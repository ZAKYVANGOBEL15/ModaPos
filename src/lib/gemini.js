import { GoogleGenAI } from "@google/genai";

let genAI = null;

const getGenAI = () => {
  if (genAI) return genAI;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }
  genAI = new GoogleGenAI({ apiKey });
  return genAI;
};

export const getAIInsights = async (products, transactions) => {
  const prompt = `
    You are an expert business analyst for ModaPos, a modern universal POS system.
    Analyze the following data and provide:
    1. A summary of current sales performance.
    2. Prediction for next week's sales.
    3. Recommendations on which products to restock or promote.

    Data:
    Products: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, price: p.price, category: p.category })))}
    Recent Transactions: ${JSON.stringify(transactions.map(t => ({ total: t.total, items: t.items, date: t.date, status: t.status })))}

    Please provide the response in Indonesian, in a professional but encouraging tone. 
    Use markdown for formatting. Keep it concise.
  `;

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const startAIChat = (products, transactions) => {
  const ai = getGenAI();
  return ai.chats.create({ 
    model: "gemini-3.5-flash",
    config: {
      systemInstruction: {
        role: "system",
        parts: [{
          text: `
            You are "ModaPos Assistant", an expert AI business advisor for any retail business (General Store, F&B, Electronics, Fashion, etc.).
            You have access to the store's current data:
            - Products: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock, price: p.price, category: p.category })))}
            - Transactions: ${JSON.stringify(transactions.map(t => ({ total: t.total, items: t.items, date: t.date, status: t.status })))}

            Your goal is to help the store owner understand their business, predict trends, and manage inventory regardless of the industry.
            Always answer in Indonesian. Be professional, helpful, and concise. 
            PENTING: Gunakan istilah "Stok" untuk menyebut jumlah barang.
            If asked about best sellers, analyze the transaction data. 
            If asked about stock, check the product data.
            Berikan saran strategis untuk meningkatkan keuntungan berdasarkan tren data yang ada.
          `
        }]
      }
    },
    history: [],
  });
};

