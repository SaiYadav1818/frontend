import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIX
import BuyGold from "./BuyGold";
import SellGold from "./SellGold";
import GoldPriceChart from "../components/GoldPriceChart";
import { getGoldRates } from "../api/augmontApi";

export default function Portfolio() {
  const navigate = useNavigate(); // ✅ FIX

  const [gold, setGold] = useState(0);
  const [value, setValue] = useState(0);
  const [invested, setInvested] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      const stored = Number(localStorage.getItem("goldBalance") || 0);
      setGold(stored);

      try {
        const rates = await getGoldRates();
        const price = parseFloat(
          rates?.payload?.result?.data?.rates?.gBuy || 0
        );

        localStorage.setItem("goldPrice", price);

        setValue(stored * price);
        setInvested(stored * price * 0.9);
      } catch (e) {
        console.log(e);
      }
    };

    load();

    // ✅ LIVE UPDATE
    window.addEventListener("goldBalanceUpdated", load);

    return () =>
      window.removeEventListener("goldBalanceUpdated", load);
  }, []);

  const profit = useMemo(() => value - invested, [value, invested]);

  const profitPercent = useMemo(() => {
    if (!invested) return 0;
    return ((profit / invested) * 100).toFixed(2);
  }, [profit, invested]);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* 🔥 TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-yellow-400 hover:text-yellow-300 font-medium"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-xl font-semibold">Portfolio</h1>

        <div></div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="space-y-6 max-w-5xl mx-auto p-6">

        {/* 🔥 TOP CARD */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-300/5 border border-yellow-400/20 rounded-2xl p-6">
          <p className="text-white/50 text-sm">Portfolio Value</p>

          <h1 className="text-4xl font-bold text-yellow-400 mt-2">
            ₹{value.toLocaleString()}
          </h1>

          <p
            className={`mt-2 text-sm ${
              profit >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()} ({profitPercent}%)
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#111] p-4 rounded-xl">
            <p className="text-white/50 text-xs">Gold</p>
            <h3 className="font-semibold text-lg">
              {gold.toFixed(3)} g
            </h3>
          </div>

          <div className="bg-[#111] p-4 rounded-xl">
            <p className="text-white/50 text-xs">Invested</p>
            <h3 className="font-semibold text-lg">
              ₹{invested.toFixed(0)}
            </h3>
          </div>

          <div className="bg-[#111] p-4 rounded-xl">
            <p className="text-white/50 text-xs">Profit</p>
            <h3
              className={`text-lg ${
                profit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹{profit.toFixed(0)}
            </h3>
          </div>
        </div>

        {/* 🔥 TABS */}
        <div className="flex gap-6 border-b border-white/10">
          {["overview", "buy", "sell"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-2 text-sm font-semibold transition ${
                activeTab === t
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🔥 CONTENT */}
        {activeTab === "overview" && (
          <GoldPriceChart />
        )}

        {activeTab === "buy" && <BuyGold />}
        {activeTab === "sell" && <SellGold />}

      </div>
    </div>
  );
}