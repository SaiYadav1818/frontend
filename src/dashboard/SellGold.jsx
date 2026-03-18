import { useEffect, useMemo, useState } from "react";
import { Coins } from "lucide-react";
import { getGoldRates } from "../api/augmontApi";

export default function SellGold() {
  const [goldOwned, setGoldOwned] = useState(0);
  const [grams, setGrams] = useState(1);
  const [goldPrice, setGoldPrice] = useState(6554);

  useEffect(() => {
    const stored = Number(localStorage.getItem("goldBalance") || 0);
    setGoldOwned(stored);

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

  const payout = useMemo(() => {
    return (Number(grams) * goldPrice).toFixed(2);
  }, [grams, goldPrice]);

  const handleSell = () => {
    const amountToSell = Number(grams);

    if (amountToSell <= 0) {
      alert("Enter a valid gold quantity to sell.");
      return;
    }

    if (amountToSell > goldOwned) {
      alert("Not enough gold balance to sell.");
      return;
    }

    const updated = goldOwned - amountToSell;
    localStorage.setItem("goldBalance", updated.toFixed(3));
    setGoldOwned(updated);

    alert(`Sell order placed for ${amountToSell}g. Payout ₹${payout}`);
  };

  return (
    <div className="space-y-10 max-w-full">
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10">
        <p className="text-white/60 text-sm">Gold Balance</p>
        <h2 className="text-4xl font-bold text-yellow-400">{goldOwned.toFixed(3)} grams</h2>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold">Sell Digital Gold</h3>

        <div className="flex flex-wrap gap-4">
          {[1, 5, 10].map((value) => (
            <button
              key={value}
              onClick={() => setGrams(value)}
              className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              {value} grams
            </button>
          ))}
          <button
            onClick={() => setGrams(goldOwned)}
            className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Sell All
          </button>
        </div>

        <div>
          <label className="text-white/60 text-sm">Enter Gold Quantity</label>
          <input
            type="number"
            step="0.001"
            value={grams}
            onChange={(e) => setGrams(Number(e.target.value) || 0)}
            className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
          />
        </div>

        <div className="bg-black border border-white/10 rounded-xl p-5">
          <div className="flex justify-between text-lg font-semibold text-yellow-400">
            <span>Total Payout</span>
            <span>₹{payout}</span>
          </div>
        </div>

        <button
          onClick={handleSell}
          className="w-full bg-yellow-500 text-black py-4 rounded-xl font-semibold hover:scale-105 transition"
        >
          Sell Gold
        </button>
      </div>
    </div>
  );
}
