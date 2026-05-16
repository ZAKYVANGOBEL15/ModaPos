import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from "../assets/image/Logo.png";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { db, auth } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { startAIChat } from "../lib/gemini";

export function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Saya ModaPos Assistant. Ada yang bisa saya bantu hari ini mengenai bisnis Anda?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      if (!auth.currentUser) return;
      setError(null);
      try {
        const uid = auth.currentUser.uid;
        const qProd = query(collection(db, "products"), where("userId", "==", uid));
        const qTrans = query(collection(db, "transactions"), where("userId", "==", uid));

        const [prodSnap, transSnap] = await Promise.all([
          getDocs(qProd),
          getDocs(qTrans)
        ]);

        const products = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const transactions = transSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const session = startAIChat(products, transactions);
        setChatSession(session);
      } catch (err) {
        console.error("Chat Init Error:", err);
        setError(err.message || "Gagal menyambungkan ke AI. Pastikan API Key benar.");
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatSession || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMessage });
      const text = result.text;
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi nanti." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Business Advisor
          </h1>
          <p className="text-muted-foreground mt-1">Tanya apa saja tentang performa toko Anda.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])} className="text-muted-foreground">
          <Trash2 className="h-4 w-4 mr-2" /> Clear Chat
        </Button>
      </div>

      <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-muted/10"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border border-border"
                  }`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <img src={logo} alt="ModaPos" className="h-full w-full object-cover" />}
                </div>
                <div className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-white border border-border rounded-tl-none text-foreground"
                  }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={logo} alt="ModaPos" className="h-full w-full object-cover" />
                </div>
                <div className="bg-white border border-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="flex gap-3 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatSession ? "Tanya tentang stok, barang paling laku, atau saran bisnis..." : "Sedang menyambungkan ke AI..."}
              className="pr-12 h-12 rounded-xl focus:ring-primary"
              disabled={loading || !chatSession}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim() || !chatSession}
              className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm z-10"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <p className="text-xs text-red-600 mb-2">{error}</p>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="h-7 text-[10px]">
                Coba Lagi
              </Button>
            </div>
          )}
          {!chatSession && !error && (
            <p className="text-[10px] text-center text-primary mt-3 animate-pulse font-medium uppercase tracking-widest">
              Menghubungkan ke AI Advisor...
            </p>
          )}
          <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-widest font-medium opacity-50">
            Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
