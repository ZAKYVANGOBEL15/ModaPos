import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Store, User, ArrowRight, Loader2, MapPin, Sparkles } from "lucide-react";
import logo from "../assets/image/Logo.png";
import banner from "../assets/image/Banner.jpg";

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
      navigate("/app", { replace: true });
    } catch (error) {
      console.error("Onboarding Error:", error);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2010] via-[#1A4020] to-[#2D6B35] p-4 lg:p-0">
      <div className="w-full max-w-4xl h-full lg:h-[620px] flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200">

        {/* Left: Banner Section */}
        <div className="lg:w-1/2 relative hidden lg:block overflow-hidden">
          <img
            src={banner}
            alt="Setup Toko Banner"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-12">

            <h2 className="text-4xl font-bold text-white leading-tight">
              Siapkan Toko Anda<br />dalam 60 Detik.
            </h2>
            <p className="text-white/80 mt-4 text-sm max-w-sm">
              Isi profil toko Anda sekarang. ModaPos akan langsung siap membantu Anda mengelola stok, transaksi, dan laporan bisnis dengan AI.
            </p>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center overflow-y-auto bg-white">
          <div className="flex flex-col items-center lg:items-start mb-6 text-center lg:text-left">
            <div className="h-12 w-12 flex items-center justify-center mb-4 overflow-hidden">
              <img src={logo} alt="ModaPos" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-2xl font-sans text-gray-900 tracking-tight font-semibold">Selamat Datang!</h1>
            <p className="text-gray-500 mt-1 text-sm">Lengkapi profil toko Anda untuk memulai.</p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-4">
            {/* Nama Pengguna */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#6FCF97]" /> Nama Anda
              </label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97]"
              />
            </div>

            {/* Nama Toko */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-[#6FCF97]" /> Nama Toko
              </label>
              <Input
                placeholder="Contoh: Toko Jaya Makmur"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97]"
              />
            </div>

            {/* Alamat Toko */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#6FCF97]" /> Alamat Toko
                <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <Input
                placeholder="Jl. Raya No. 123, Kota Anda"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97]"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-bold rounded-xl mt-2 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Mulai Pakai ModaPos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
