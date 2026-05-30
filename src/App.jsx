import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { POS } from "./pages/POS";
import { Transactions } from "./pages/Transactions";
import { AIChat } from "./pages/AIChat";
import { ReceiptScanner } from "./pages/ReceiptScanner";
import { Onboarding } from "./pages/Onboarding";
import { Landing } from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* /register diredirect ke /login - auth ditangani Google OAuth */}
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="pos" element={<POS />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="ai" element={<AIChat />} />
          <Route path="scanner" element={<ReceiptScanner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
