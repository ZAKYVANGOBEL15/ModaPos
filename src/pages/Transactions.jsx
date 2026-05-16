import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, FileText, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { db, auth } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, where, doc, updateDoc, increment, serverTimestamp, deleteDoc } from "firebase/firestore";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [trxToDelete, setTrxToDelete] = useState(null);
  const [trxToCancel, setTrxToCancel] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "transactions"), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const rawDate = doc.data().createdAt?.toDate();
        return { 
          id: doc.id, 
          ...doc.data(),
          rawDate: rawDate,
          date: rawDate ? rawDate.toLocaleString("id-ID") : "Processing..."
        };
      });
      setTransactions(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteTransaction = (trx) => {
    setTrxToDelete(trx);
  };

  const confirmDeleteTransaction = async () => {
    if (!trxToDelete) return;
    setDeletingId(trxToDelete.id);
    try {
      await deleteDoc(doc(db, "transactions", trxToDelete.id));
      toast.success("Transaksi dihapus secara permanen");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Gagal menghapus transaksi");
    } finally {
      setDeletingId(null);
      setTrxToDelete(null);
    }
  };

  const handleCancelTransaction = (trx) => {
    if (trx.status === "Cancelled") return;
    setTrxToCancel(trx);
  };

  const confirmCancelTransaction = async () => {
    if (!trxToCancel) return;
    setCancellingId(trxToCancel.id);
    try {
      const stockUpdates = trxToCancel.items.map(item => {
        const productRef = doc(db, "products", item.id);
        return updateDoc(productRef, {
          stock: increment(item.qty)
        });
      });
      await Promise.all(stockUpdates);
      await updateDoc(doc(db, "transactions", trxToCancel.id), {
        status: "Cancelled",
        cancelledAt: serverTimestamp()
      });
      toast.success("Transaksi dibatalkan & stok dikembalikan.");
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      toast.error("Gagal membatalkan transaksi: " + error.message);
    } finally {
      setCancellingId(null);
      setTrxToCancel(null);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const searchLower = search.toLowerCase();
    const matchesId = t.id.toLowerCase().includes(searchLower);
    const matchesItems = t.items?.some(item => item.name.toLowerCase().includes(searchLower));
    
    let matchesDate = true;
    if (dateFilter && t.rawDate) {
      // Convert transaction date to YYYY-MM-DD local timezone format for comparison
      const trxDateStr = t.rawDate.toLocaleDateString("en-CA"); 
      matchesDate = trxDateStr === dateFilter;
    }

    return (matchesId || matchesItems) && matchesDate;
  });

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["Transaction ID", "Date", "Items", "Total (Rp)", "Status"];
    const rows = filteredTransactions.map(trx => [
      trx.id,
      trx.date,
      trx.items?.map(i => `${i.name} (x${i.qty})`).join("; "),
      trx.total,
      trx.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
        <p className="text-muted-foreground mt-1">Lihat riwayat penjualan dan struk Anda.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID transaksi..." 
                className="pl-9" 
              />
            </div>
            <div className="w-40">
              <Input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-muted-foreground cursor-pointer"
              />
            </div>
            {dateFilter && (
              <Button variant="ghost" onClick={() => setDateFilter("")} className="text-muted-foreground">
                Hapus Tanggal
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={handleExportCSV}>Ekspor CSV</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium border-r border-border">ID Transaksi</th>
              <th className="px-6 py-4 font-medium border-r border-border">Tanggal & Waktu</th>
              <th className="px-6 py-4 font-medium border-r border-border">Item</th>
              <th className="px-6 py-4 font-medium border-r border-border">Total</th>
              <th className="px-6 py-4 font-medium border-r border-border">Status</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Memuat transaksi...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                  Tidak ada transaksi.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx) => (
                <tr key={trx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 border-r border-border">
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-[#2D3436]">
                        {trx.items && trx.items.length > 0 
                          ? `Pesanan ${trx.items[0].name}${trx.items.length > 1 ? ` + ${trx.items.length - 1} lainnya` : ""}`
                          : `Pesanan #${trx.id.substring(0, 5)}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                        ID: {trx.id.substring(0, 8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground border-r border-border">{trx.date}</td>
                  <td className="px-6 py-4 border-r border-border">{trx.itemCount}</td>
                  <td className="px-6 py-4 font-medium border-r border-border">Rp {trx.total.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4 border-r border-border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trx.status === "Cancelled" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {trx.status !== "Cancelled" ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelTransaction(trx)}
                        disabled={cancellingId === trx.id}
                      >
                        {cancellingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Batal"}
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteTransaction(trx)}
                        disabled={deletingId === trx.id}
                      >
                        {deletingId === trx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hapus"}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {trxToCancel && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-500/10 text-yellow-500 flex items-center justify-center rounded-full mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Batalkan Transaksi?</h3>
            <p className="text-[#A1A1AA] mb-8 text-sm">Tindakan ini akan mengembalikan stok produk yang terjual. Anda yakin?</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-[#333333] bg-transparent text-white hover:bg-[#222222]" onClick={() => setTrxToCancel(null)}>Tidak</Button>
              <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-[#111111] font-bold border-transparent" onClick={confirmCancelTransaction}>Ya, Batal</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {trxToDelete && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 flex items-center justify-center rounded-full mb-6">
              <Trash2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hapus Transaksi?</h3>
            <p className="text-[#A1A1AA] mb-8 text-sm">Tindakan ini akan menghapus riwayat transaksi secara permanen.</p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-[#333333] bg-transparent text-white hover:bg-[#222222]" onClick={() => setTrxToDelete(null)}>Batal</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white border-transparent" onClick={confirmDeleteTransaction}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
