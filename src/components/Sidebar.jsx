import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { LayoutDashboard, ShoppingCart, Package, Receipt, MessageSquare, Scan, LogOut, Menu, X, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import logo from "../assets/image/Logo.png";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [saving, setSaving] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dasbor", path: "/app" },
    { icon: ShoppingCart, label: "POS", path: "/app/pos" },
    { icon: Package, label: "Produk", path: "/app/products" },
    { icon: Receipt, label: "Transaksi", path: "/app/transactions" },
    { icon: Scan, label: "Scanner AI", path: "/app/scanner" },
    { icon: MessageSquare, label: "Asisten AI", path: "/app/ai" },
  ];

  const linkRefs = useRef([]);

  const fetchSettings = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, "settings", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStoreName(data.storeName || "");
        setAddress(data.address || "");
        setUserName(data.userName || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", auth.currentUser.uid), {
        storeName,
        address,
        userName,
        updatedAt: serverTimestamp(),
        userId: auth.currentUser.uid
      });
      toast.success("Pengaturan berhasil disimpan!");
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isSettingsOpen) {
      fetchSettings();
    } else {
      // Also fetch once on mount to show the name in sidebar
      fetchSettings();
    }
  }, [isSettingsOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const isExpanded = isHovered || isOpen;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-[45] flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ModaPos" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold text-[#2D3436] tracking-tight font-serif">ModaPos.</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#F8FAFC] rounded-lg border border-border text-[#2D3436] shadow-sm"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          bg-[#111111] flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? "w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className={`p-6 flex items-center transition-all duration-300 ${isExpanded ? "px-6" : "px-5"}`}>
          <div className="flex items-center gap-3 min-w-max">
            <img src={logo} alt="ModaPos" className="h-10 w-10 object-contain shrink-0" />
            <h1 className={`text-2xl font-bold text-white tracking-tight font-serif transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 w-0"
            }`}>
              ModaPos.
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[#222222] text-white shadow-md border border-[#333333]"
                    : "text-[#888888] hover:bg-[#222222] hover:text-white"
                }`
              }
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
              }`}>
                {item.label}
              </span>
            </NavLink>
          ))}
          
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-[#888888] hover:bg-[#222222] hover:text-white`}
          >
            <SettingsIcon className="h-6 w-6 shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
            }`}>
              Pengaturan
            </span>
          </button>
        </nav>

        <div className="p-3 border-t border-[#222222]">
          <div className={`flex items-center gap-4 px-4 py-3 mb-2 rounded-xl text-white bg-[#222222] transition-all duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 invisible h-0 py-0 mb-0"
          }`}>
            <div className="h-8 w-8 rounded-full bg-[#333333] border border-[#444444] flex items-center justify-center text-white font-bold shrink-0">
              {(userName || auth.currentUser?.email)?.[0].toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold truncate">{userName || "Akun Pengguna"}</span>
              <span className="text-[10px] text-[#888888] truncate">{auth.currentUser?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors"
          >
            <LogOut className="h-6 w-6 shrink-0" />
            <span className={`font-medium transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <SettingsIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Pengaturan Toko</h2>
                  <p className="text-xs text-muted-foreground">Atur identitas bisnis Anda</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Nama Anda</label>
                <Input 
                  placeholder="Masukkan nama Anda" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Nama Toko</label>
                <Input 
                  placeholder="Contoh: Toko Sukses Makmur" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Alamat Toko</label>
                <Input 
                  placeholder="Jl. Merdeka No. 123" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsSettingsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

