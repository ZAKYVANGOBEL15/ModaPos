import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Image as ImageIcon, Loader2, X, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { db, storage, auth } from "../lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, deleteDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
   const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const formatCurrency = (val) => {
    if (!val) return "";
    const num = val.toString().replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (val) => {
    return val.toString().replace(/\./g, "");
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  // Fetch Products Real-time
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(
      collection(db, "products"), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(formatCurrency(product.price.toString()));
    setStock(product.stock.toString());
    setImagePreview(product.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    
    setSaving(true);
    try {
      let imageUrl = editingProduct ? editingProduct.imageUrl : "";
      
      // If user chose to remove existing image
      if (removeExistingImage && editingProduct?.imageUrl) {
        try {
          const oldRef = ref(storage, editingProduct.imageUrl);
          await deleteObject(oldRef);
        } catch (e) { console.warn("Failed to delete old image from storage", e); }
        imageUrl = "";
      }
      
      // 1. Upload Image to Storage if a new file is selected
      if (imageFile) {
        // If updating and there was an old image, delete it first
        if (editingProduct?.imageUrl && !removeExistingImage) {
          try {
            const oldRef = ref(storage, editingProduct.imageUrl);
            await deleteObject(oldRef);
          } catch (e) { console.warn("Failed to delete old image", e); }
        }

        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const uploadTask = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      const productData = {
        name,
        price: Number(parseCurrency(price)),
        stock: Number(stock),
        category: category || "Uncategorized",
        imageUrl,
        userId: auth.currentUser.uid,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        // Update existing
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        // Create new
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      if (productToDelete.imageUrl) {
        try {
          const imageRef = ref(storage, productToDelete.imageUrl);
          await deleteObject(imageRef);
        } catch (e) { console.warn("Failed to delete image from storage during product deletion", e); }
      }
      await deleteDoc(doc(db, "products", productToDelete.id));
      toast.success("Produk berhasil dihapus");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produk</h1>
          <p className="text-muted-foreground mt-1">Kelola inventaris toko Anda.</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari produk..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium border-r border-border">Produk</th>
              <th className="px-6 py-4 font-medium border-r border-border">Kategori</th>
              <th className="px-6 py-4 font-medium border-r border-border">Harga</th>
              <th className="px-6 py-4 font-medium border-r border-border">Stok</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Memuat produk...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-5 flex items-center gap-3 border-r border-border">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-border shadow-sm">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                      )}
                    </div>
                    <span className="font-bold text-base text-[#2D3436]">{product.name}</span>
                  </td>
                  <td className="px-6 py-5 text-[#636E72] font-medium border-r border-border">{product.category}</td>
                  <td className="px-6 py-5 font-bold text-[#6FCF97] border-r border-border">Rp {product.price.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-5 font-medium border-r border-border">{product.stock}</td>
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product)}>Hapus</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveProduct} className="bg-card w-full max-w-md p-6 rounded-2xl shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-4">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Produk</label>
                <Input 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Cth: Kemeja Flanel" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="Cth: Atasan" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Harga (Rp)</label>
                  <Input 
                    required
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(formatCurrency(e.target.value))}
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stok</label>
                  <Input 
                    required
                    type="number" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gambar Produk</label>
                {imagePreview && (
                  <div className="relative w-full h-32 bg-muted rounded-xl overflow-hidden border border-border mb-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        if (editingProduct) setRemoveExistingImage(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!imagePreview && (
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                        setRemoveExistingImage(false);
                      }
                    }}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="ghost" onClick={resetForm}>Batal</Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : editingProduct ? "Perbarui Produk" : "Simpan Produk"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 flex items-center justify-center rounded-full mb-6">
              <Trash2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hapus Produk?</h3>
            <p className="text-[#A1A1AA] mb-8 text-sm">Anda yakin ingin menghapus "{productToDelete.name}"? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-[#333333] bg-transparent text-white hover:bg-[#222222]" onClick={() => setProductToDelete(null)}>Batal</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white border-transparent" onClick={confirmDelete}>Ya, Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
