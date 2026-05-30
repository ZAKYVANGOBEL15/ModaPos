import { useState } from "react";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import logo from "../assets/image/Logo.png";
import banner from "../assets/image/Banner.jpg";

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/app");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D2010] via-[#1A4020] to-[#2D6B35] p-4 lg:p-0">
      <div className="w-full max-w-4xl h-full lg:h-[580px] flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200">

        {/* Left: Banner Section */}
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

        {/* Right: Sign In Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center bg-white">
          <div className="h-16 w-16 flex items-center justify-center mb-5 overflow-hidden">
            <img src={logo} alt="ModaPos" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-sans text-gray-900 tracking-tight font-semibold">ModaPos.</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xs">
            Masuk untuk mulai mengelola bisnis Anda dengan kecerdasan AI.
          </p>

          <div className="w-full mt-10 max-w-xs space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-12 px-6 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-semibold text-sm hover:bg-gray-50 hover:border-[#6FCF97] hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              ) : (
                <>
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Masuk / Daftar dengan Google
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
              <ShieldCheck className="h-3.5 w-3.5 text-[#6FCF97]" />
              <span>Aman & terverifikasi oleh Google OAuth 2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
