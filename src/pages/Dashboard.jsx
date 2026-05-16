import { useState, useEffect } from "react";
import { TrendingUp, Package, DollarSign, Users, Loader2 } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";

export function Dashboard() {
  const [stats, setStats] = useState([
    { name: "Total Pendapatan", value: "Rp 0", icon: DollarSign, trend: "Langsung" },
    { name: "Penjualan Hari Ini", value: "0", icon: TrendingUp, trend: "Hari Ini" },
    { name: "Produk Aktif", value: "0", icon: Package, trend: "Tersedia" },
    { name: "Pelanggan", value: "0", icon: Users, trend: "Total" },
  ]);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    // 1. Listen to Transactions
    const qTrans = query(collection(db, "transactions"), where("userId", "==", uid));
    const unsubTrans = onSnapshot(qTrans, (snapshot) => {
      let totalRevenue = 0;
      let salesToday = 0;
      const today = new Date().toLocaleDateString();
      
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        const docDate = data.createdAt?.toDate().toLocaleDateString();
        
        if (data.status !== "Cancelled") {
          totalRevenue += data.total || 0;
          if (docDate === today) {
            salesToday += 1;
          }
        }
        return { id: doc.id, ...data };
      });

      // Sort client-side to avoid complex index for now, or use index link if provided
      const sorted = docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)).slice(0, 8);
      setRecentTransactions(sorted);

      setStats(prev => {
        const newStats = [...prev];
        newStats[0].value = `Rp ${totalRevenue.toLocaleString("id-ID")}`;
        newStats[1].value = salesToday.toString();
        newStats[3].value = snapshot.size.toString();
        return newStats;
      });
      setLoading(false);
    }, (error) => {
      console.error("Transaction Listener Error:", error);
    });

    // 2. Listen to Products
    const qProd = query(collection(db, "products"), where("userId", "==", uid));
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      setStats(prev => {
        const newStats = [...prev];
        newStats[2].value = snapshot.size.toString();
        return newStats;
      });
    }, (error) => {
      console.error("Product Listener Error:", error);
    });

    return () => {
      unsubTrans();
      unsubProd();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dasbor</h1>
        <p className="text-muted-foreground mt-1">Ringkasan performa toko Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card p-6 rounded-xl border border-border shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold">Transaksi Terakhir</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold">
              <tr>
                <th className="px-6 py-4 text-left">ID Pesanan</th>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">#{trx.id.substring(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm">{trx.createdAt?.toDate().toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold">Rp {trx.total?.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      trx.status === "Completed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground italic">
                    Belum ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
