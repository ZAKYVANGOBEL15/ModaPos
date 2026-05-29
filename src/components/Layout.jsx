import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, "settings", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            setNeedsOnboarding(true);
          }
        } catch (error) {
          console.error("Layout Check Error:", error);
        }
      }
      
      setOnboardingChecked(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !onboardingChecked) {
    return <div className="dashboard-app min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Memuat...</p>
      </div>
    </div>;
  }

  // If mock/no config, allow access anyway for development
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!user && hasFirebaseConfig) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="dashboard-app flex h-screen overflow-hidden bg-[#111111]">
      <Sidebar />
      <main className="flex-1 flex flex-col pt-16 lg:pt-3 lg:pr-3 lg:pb-3 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] lg:rounded-[2rem] shadow-2xl relative border border-border/50 lg:border-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
