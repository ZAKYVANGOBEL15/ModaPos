import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, ShoppingCart, Trash2, Plus, Minus, Loader2, Image as ImageIcon, Receipt } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, where, getDoc } from "firebase/firestore";

export function POS() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [settings, setSettings] = useState(null);

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

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;
      const docSnap = await getDoc(doc(db, "settings", auth.currentUser.uid));
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    };
    fetchSettings();
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("Stok habis!");
      return;
    }
    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          toast.error("Melebihi stok yang tersedia!");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta, currentStock) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty > currentStock) {
            toast.error("Stok tidak cukup!");
            return item;
          }
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || !auth.currentUser) return;
    
    setProcessing(true);
    try {
      // 1. Create Transaction Document
      const transactionData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        total,
        itemCount: cart.reduce((sum, item) => sum + item.qty, 0),
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: "Completed"
      };

      await addDoc(collection(db, "transactions"), transactionData);

      // 2. Update Product Stocks
      const stockUpdates = cart.map(item => {
        const productRef = doc(db, "products", item.id);
        return updateDoc(productRef, {
          stock: increment(-item.qty)
        });
      });

      await Promise.all(stockUpdates);

      // 3. Success!
      setLastTransaction({
        ...transactionData,
        id: Math.random().toString(36).substr(2, 9).toUpperCase() // Temporary ID for receipt
      });
      setShowSuccessModal(true);
      setCart([]);
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast.error("Failed to process transaction: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptHtml = `
      <html>
        <head>
          <title>Struk Pembayaran - ${settings?.storeName || 'ModaPos'}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 80mm; 
              padding: 10mm; 
              font-size: 12px;
              color: #333;
            }
            .text-center { text-align: center; }
            .header { margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
            .store-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .items { margin-bottom: 20px; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-row { border-top: 1px dashed #ccc; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between; font-size: 14px; }
            .footer { margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header text-center">
            <div class="store-name">${settings?.storeName || 'MODAPOS'}</div>
            <div>${settings?.address || 'Terima Kasih Telah Berbelanja'}</div>
            <div style="margin-top: 10px; font-size: 10px;">
              ${new Date().toLocaleString()}
            </div>
          </div>
          
          <div class="items">
            ${lastTransaction.items.map(item => `
              <div class="item-row">
                <span>${item.name} x${item.qty}</span>
                <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="total-row">
            <span>TOTAL</span>
            <span>Rp ${lastTransaction.total.toLocaleString('id-ID')}</span>
          </div>
          
          <div class="footer text-center">
            <p>BARANG YANG SUDAH DIBELI<br>TIDAK DAPAT DITUKAR/DIKEMBALIKAN</p>
            <p style="margin-top: 10px; font-weight: bold;">TERIMA KASIH</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-screen overflow-hidden">
      {/* Product List */}
      <div className="flex-1 flex flex-col min-h-0 bg-muted/20">
        <div className="p-6 border-b border-border bg-background">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..." 
              className="pl-9 h-12 text-lg" 
            />
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`bg-card border border-border rounded-xl p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    product.stock > 0 ? "hover:border-primary" : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={product.stock <= 0}
                >
                  <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-border shadow-sm">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-[#2D3436] leading-tight h-14 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-[#6FCF97] font-black text-base">Rp {product.price.toLocaleString("id-ID")}</p>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[#EEEEEE] text-slate-400">
                      S: {product.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`w-full lg:w-96 bg-card lg:border-l flex flex-col shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${
        cart.length === 0 
          ? "h-0 lg:h-full border-transparent lg:border-border opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto" 
          : "h-[55vh] lg:h-full border-t border-border opacity-100 pointer-events-auto shadow-[0_-20px_40px_rgba(0,0,0,0.08)] lg:shadow-none"
      }`}>
        <div className="p-6 border-b border-border flex items-center gap-3">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-lg font-bold">Pesanan Saat Ini</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border border-border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-base text-[#2D3436] line-clamp-1">{item.name}</h4>
                  <p className="text-sm font-medium text-[#6FCF97]">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button 
                      onClick={() => updateQty(item.id, -1, item.stock)} 
                      className="p-1 hover:bg-muted text-muted-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.id, 1, item.stock)} 
                      className="p-1 hover:bg-muted text-muted-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded-md">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-border bg-background">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <Button 
            className="w-full h-14 text-lg" 
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              `Charge Rp ${total.toLocaleString("id-ID")}`
            )}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-border p-8 text-center animate-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 rotate-45 scale-150 transition-transform duration-500" style={{ transform: 'rotate(0deg)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[#2D3436]">Transaksi Sukses!</h2>
            <p className="text-muted-foreground text-sm mb-8">Pembayaran berhasil diproses dan stok telah diperbarui.</p>
            
            <div className="space-y-3">
              <Button onClick={handlePrint} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg">
                <Receipt className="mr-2 h-5 w-5" /> Cetak Struk
              </Button>
              <Button variant="ghost" onClick={() => setShowSuccessModal(false)} className="w-full h-12 text-muted-foreground hover:text-foreground">
                Selesai
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
