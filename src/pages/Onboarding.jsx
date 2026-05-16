import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Sparkles, Store, User, ArrowRight, Loader2 } from "lucide-react";
import logo from "../assets/image/Logo.png";

export function Onboarding() {
  const [userName, setUserName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCompleteOnboarding = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "settings", auth.currentUser.uid), {
        userName,
        storeName,
        address,
        userId: auth.currentUser.uid,
        onboardingCompleted: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Redirect to dashboard
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Onboarding Error:", error);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#141414] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-[#2A2A2A]">
        {/* Left Side - Visual */}
        <div className="bg-[#1A1A1A] p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <img src={logo} alt="ModaPos" className="h-12 w-12 object-contain mb-8" />
            <h1 className="text-4xl font-bold text-white leading-tight">
              Selamat Datang di <span className="text-[#6FCF97] font-serif italic">ModaPos.</span>
            </h1>
            <p className="text-[#A1A1AA] mt-4 text-sm leading-relaxed">
              Mari siapkan ruang kerja digital Anda dalam hitungan detik.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#6FCF97]/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6FCF97]/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:p-12">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Siapkan Profil Anda</h2>
            <p className="text-xs text-[#888888] mt-1">Lengkapi data berikut untuk memulai.</p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
                <User className="h-3 w-3" /> Nama Anda
              </label>
              <Input 
                placeholder="Masukkan nama lengkap"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="h-12 rounded-xl bg-[#1E1E1E] border-[#333333] text-white focus:border-[#6FCF97] placeholder:text-[#555]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
                <Store className="h-3 w-3" /> Nama Toko
              </label>
              <Input 
                placeholder="Contoh: Toko Jaya Baru"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="h-12 rounded-xl bg-[#1E1E1E] border-[#333333] text-white focus:border-[#6FCF97] placeholder:text-[#555]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
                 Alamat Toko
              </label>
              <Input 
                placeholder="Jl. Raya No. 123"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 rounded-xl bg-[#1E1E1E] border-[#333333] text-white focus:border-[#6FCF97] placeholder:text-[#555]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg mt-8 group bg-white text-[#111111] hover:bg-gray-200 border border-transparent"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
