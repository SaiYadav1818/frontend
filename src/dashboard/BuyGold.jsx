import { useEffect, useMemo, useState } from "react";
import { Coins, TrendingUp } from "lucide-react";
import { getGoldRates } from "../api/augmontApi";

export default function BuyGold() {
  const [goldPrice, setGoldPrice] = useState(6554);
  const [amount, setAmount] = useState(5000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await getGoldRates();
        const price = parseFloat(data?.payload?.result?.data?.rates?.gBuy || 0);
        if (price > 0) setGoldPrice(price);
      } catch (error) {
        console.error("Failed to load gold rates", error);
      }
    };

    loadRates();
  }, []);

  const grams = useMemo(() => {
    if (!goldPrice || !amount) return 0;
    return (Number(amount) / goldPrice).toFixed(3);
  }, [amount, goldPrice]);

  const gst = useMemo(() => (Number(amount) * 0.03).toFixed(2), [amount]);
  const total = useMemo(() => (Number(amount) + Number(gst)).toFixed(2), [amount, gst]);

  const handleBuy = () => {
    const existing = Number(localStorage.getItem("goldBalance") || 0);
    const updated = existing + Number(grams);
    localStorage.setItem("goldBalance", updated.toFixed(3));
    alert("Gold purchased successfully!");
  };

  return (
    <div className="space-y-10 max-w-full">
      <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-yellow-500/20 blur-[120px] rounded-full" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-white/60 text-sm">Live Gold Price</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-1">₹{goldPrice.toLocaleString()}</h2>
            <p className="text-green-400 flex items-center gap-1 mt-2 text-sm">
              <TrendingUp size={14} /> Live market rate
            </p>
          </div>
          <Coins size={40} className="text-yellow-400" />
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold">Buy Digital Gold</h3>

        <div className="flex flex-wrap gap-4">
          {[1000, 5000, 10000, 20000].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              ₹{value}
            </button>
          ))}
        </div>

        <div>
          <label className="text-white/60 text-sm">Enter Amount</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
          />
        </div>

        <div className="bg-black border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Gold Quantity</span>
            <span>{grams} grams</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (3%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-yellow-400">
            <span>Total Payable</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Buy Gold"}
        </button>
      </div>
    </div>
  );
}
