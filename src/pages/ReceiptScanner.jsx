import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Upload, Scan, Loader2, Check, X, Package, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";

let genAI = null;
const getGenAI = () => {
  if (genAI) return genAI;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }
  genAI = new GoogleGenAI({ apiKey });
  return genAI;
};

export function ReceiptScanner() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const base64Data = reader.result.split(",")[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!selectedImage) return;
    setScanning(true);
    setExtractedItems([]);

    const prompt = `
      Analisis foto nota/struk belanja ini. Ekstrak semua barang yang dibeli.
      Format output HARUS berupa JSON array of objects dengan properti:
      "name": Nama barang (singkat & rapi),
      "price": Harga Jual (estimasi dengan menambahkan markup 20-30% dari harga di nota, bulatkan ke ribuan terdekat),
      "stock": Jumlah barang (quantity),
      "category": Tebak kategori barangnya (misal: Makanan, Minuman, Elektronik, Fashion, Kebutuhan Pokok, dll).

      HANYA keluarkan JSON array tersebut. Jangan berikan teks pembuka atau penutup. 
      Contoh: [{"name": "Minyak Goreng 2L", "price": 45000, "stock": 10, "category": "Kebutuhan Pokok"}]
    `;

    try {
      const ai = getGenAI();
      // Menggunakan metode models.generateContent sesuai SDK Unified (@google/genai)
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: selectedImage.data,
                  mimeType: selectedImage.mimeType
                }
              }
            ]
          }
        ]
      });

      const responseText = result.text;
      if (!responseText) throw new Error("AI tidak memberikan respon teks.");

      // Bersihkan teks respon untuk mengambil JSON
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Format data barang tidak ditemukan. Pastikan foto nota jelas.");

      const items = JSON.parse(jsonMatch[0]);
      setExtractedItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Scanning Error:", error);
      
      const isQuotaError = 
        error.message?.includes("quota") || 
        error.message?.includes("429") || 
        error.message?.includes("RESOURCE_EXHAUSTED") ||
        JSON.stringify(error).includes("quota") ||
        JSON.stringify(error).includes("429") ||
        JSON.stringify(error).includes("RESOURCE_EXHAUSTED");

      if (isQuotaError) {
        toast.error("⚠️ Kuota AI Studio Gratis Terlampaui (429). Silakan tunggu beberapa saat atau periksa limitasi Google Cloud Anda.");
      } else {
        toast.error("AI Gagal memproses: " + (error.message || "Pastikan gambar jelas"));
      }
    } finally {
      setScanning(false);
    }
  };

  const handleSaveToInventory = async () => {
    if (extractedItems.length === 0 || !auth.currentUser) return;
    setSaving(true);
    try {
      const promises = extractedItems.map(item =>
        addDoc(collection(db, "products"), {
          ...item,
          price: Number(item.price),
          stock: Number(item.stock),
          userId: auth.currentUser.uid,
          imageUrl: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await Promise.all(promises);
      toast.success("Semua barang berhasil ditambahkan ke stok!");
      setExtractedItems([]);
      setImagePreview(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Gagal menyimpan ke database.");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (index, field, value) => {
    setExtractedItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (index) => {
    setExtractedItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#2D3436]">AI Receipt Scanner</h1>
        <p className="text-muted-foreground mt-1">Gunakan kecerdasan AI untuk input stok otomatis dari nota.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-[4/3] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${imagePreview ? "border-[#6FCF97] bg-white shadow-xl" : "border-muted-foreground/20 hover:border-[#6FCF97]/50 bg-muted/5"
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-4 rounded-3xl" />
            ) : (
              <div className="text-center p-8">
                <div className="h-16 w-16 bg-[#6FCF97]/10 text-[#6FCF97] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-lg font-bold">Klik untuk Upload Nota</p>
                <p className="text-sm text-muted-foreground mt-2">Pastikan tulisan di nota terlihat jelas</p>
              </div>
            )}
          </div>

          <Button
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg bg-[#6FCF97] hover:bg-[#6FCF97]/90 text-white"
            disabled={!selectedImage || scanning}
            onClick={startScan}
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Menganalisis Nota...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-6 w-6" />
                Mulai Scan AI
              </>
            )}
          </Button>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-xl flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-[#E8EDF2]/30">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#2D3436]">
              <Package className="h-5 w-5 text-[#6FCF97]" />
              Data Barang Terdeteksi
            </h2>
            {extractedItems.length > 0 && (
              <span className="bg-[#6FCF97]/10 text-[#6FCF97] text-xs font-bold px-3 py-1 rounded-full">
                {extractedItems.length} Produk
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {extractedItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center">
                <Scan className="h-16 w-16 mb-4 opacity-10" />
                <p className="max-w-[250px] text-sm">Upload foto nota grosir, lalu klik tombol scan untuk mulai ekstraksi data otomatis.</p>
              </div>
            ) : (
              extractedItems.map((item, index) => (
                <div key={index} className="p-4 bg-[#E8EDF2]/20 rounded-2xl border border-border group relative transition-all hover:border-[#6FCF97]/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Nama Barang</label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        className="bg-white border-none shadow-sm font-bold text-base mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Harga Jual (Rp)</label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", e.target.value)}
                        className="bg-white border-none shadow-sm font-bold text-[#6FCF97] mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Jumlah (Stok)</label>
                      <Input
                        type="number"
                        value={item.stock}
                        onChange={(e) => updateItem(index, "stock", e.target.value)}
                        className="bg-white border-none shadow-sm font-bold mt-1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {extractedItems.length > 0 && (
            <div className="p-6 border-t border-border bg-white">
              <Button
                onClick={handleSaveToInventory}
                disabled={saving}
                className="w-full h-14 bg-[#6FCF97] hover:bg-[#6FCF97]/90 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                Konfirmasi & Tambahkan ke Stok
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center opacity-40">
        <p className="text-[10px] text-[#2D3436] uppercase tracking-[0.2em] font-bold">
          Powered by Google Gemini AI
        </p>
        <div className="h-[1px] w-12 bg-[#6FCF97] mt-2 opacity-50"></div>
      </div>
    </div>
  );
}
