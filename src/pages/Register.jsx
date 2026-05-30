import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import logo from "../assets/image/Logo.png";
import banner from "../assets/image/Banner.jpg";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("Akun Anda sudah terdaftar. Silakan Masuk.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password terlalu lemah (minimal 6 karakter).");
      } else {
        toast.error("Gagal mendaftar. Silakan cek koneksi atau data Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/app");
    } catch (err) {
      toast.error("Gagal masuk dengan Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2010] via-[#1A4020] to-[#2D6B35] p-4 lg:p-0">
      <div className="w-full max-w-4xl h-full lg:h-[600px] flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200">
        {/* Banner Section */}
        <div className="lg:w-1/2 relative hidden lg:block overflow-hidden">
          <img 
            src={banner} 
            alt="Fashion Banner" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-12">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Elevate Your <br />Retail Business.
            </h2>
            <p className="text-white/80 mt-4 text-sm max-w-sm">
              Satu sistem terintegrasi untuk mengelola stok, transaksi, dan analisis AI untuk segala jenis bisnis Anda.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center overflow-y-auto bg-white">
          <div className="flex flex-col items-center lg:items-start mb-5 text-center lg:text-left">
            <div className="h-12 w-12 flex items-center justify-center mb-3 overflow-hidden">
              <img src={logo} alt="ModaPos" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-2xl font-sans text-gray-900 tracking-tight font-semibold">ModaPos.</h1>
            <p className="text-gray-600 mt-1 text-sm">Buat akun baru Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="admin@modapos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97] pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Konfirmasi Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 focus:border-[#6FCF97] pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <span className="text-xs text-gray-600 font-medium uppercase">Atau</span>
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-4 h-11 bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100 font-bold text-sm"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Daftar dengan Google
          </Button>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline font-medium">
              Sudah punya akun? Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
