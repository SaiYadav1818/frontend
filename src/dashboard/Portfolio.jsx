import { useEffect, useMemo, useState } from "react";
import { Coins, Wallet, BarChart3 } from "lucide-react";
import {
  getPortfolio,
  getGoldRates,
  getBuyTransactions,
  getSellTransactions,
} from "../api/augmontApi";
import BuyGold from "./BuyGold";
import SellGold from "./SellGold";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Portfolio() {
  const [gold, setGold] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [invested, setInvested] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadPortfolio = async () => {
      const uniqueId = localStorage.getItem("uniqueId");
      const storedGold = Number(localStorage.getItem("goldBalance") || 0);

      setGold(storedGold);

      try {
        if (!uniqueId) return;

        const portfolio = await getPortfolio(uniqueId);
        const grams = parseFloat(portfolio?.payload?.result?.data?.goldGrms || 0);
        setGold(grams);

        const rates = await getGoldRates();
        const price = parseFloat(rates?.payload?.result?.data?.rates?.gBuy || 0);
        setCurrentValue(grams * price);

        const buys = await getBuyTransactions(uniqueId);
        const sells = await getSellTransactions(uniqueId);

        const b = buys?.payload?.result?.data || [];
        const s = sells?.payload?.result?.data || [];
        const all = [...b, ...s];

        setTransactions(all.slice(0, 5));

        const investedAmount = all.reduce((acc, tx) => {
          const amount = Number(tx.amount || 0);
          return acc + amount;
        }, 0);

        setInvested(investedAmount);
      } catch (error) {
        console.error("Portfolio load failed", error);
      }
    };

    loadPortfolio();
  }, []);

  const profit = useMemo(() => currentValue - invested, [currentValue, invested]);
  const profitPercent = useMemo(() => {
    if (!invested) return 0;
    return (profit / invested) * 100;
  }, [profit, invested]);

  const chartData = useMemo(
    () => [
      { name: "Mon", value: 85000 },
      { name: "Tue", value: 89000 },
      { name: "Wed", value: 87000 },
      { name: "Thu", value: 91000 },
      { name: "Fri", value: 90000 },
      { name: "Sat", value: 92000 },
      { name: "Sun", value: 94000 },
    ],
    []
  );

  const sampleTransactions = [
    { date: "2026-03-10", type: "Buy", amount: "₹15,000", gold: "0.15g" },
    { date: "2026-03-12", type: "Sell", amount: "₹8,000", gold: "0.08g" },
    { date: "2026-03-14", type: "Buy", amount: "₹12,500", gold: "0.12g" },
    { date: "2026-03-15", type: "Buy", amount: "₹5,000", gold: "0.05g" },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
          <div className="bg-[#0b0b0b] rounded-3xl p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div>
                <p className="text-white/50 text-sm tracking-wide">Total Portfolio Value</p>
                <h2 className="mt-3 text-5xl md:text-6xl font-bold text-yellow-400 leading-tight">
                  ₹{currentValue.toLocaleString()}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="inline-flex items-center gap-2">
                    <BarChart3 size={18} className={profit >= 0 ? "text-emerald-300" : "text-rose-300"} />
                    <span className={profit >= 0 ? "text-emerald-200" : "text-rose-200"}>
                      {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                    </span>
                  </div>
                  <span className="text-white/40">{gold.toFixed(3)}g gold holdings</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white/50 text-sm tracking-wide">Gold Holdings</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mt-1">
                  {gold.toFixed(3)} grams
                </h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-6 border-b border-white/10 pb-6 mb-8">
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="text-white/60 text-sm tracking-wide">Gold Owned</span>
              <span className="text-xl font-semibold text-white">{gold.toFixed(3)}g</span>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="text-white/60 text-sm tracking-wide">Total Invested</span>
              <span className="text-xl font-semibold text-white">₹{invested.toLocaleString()}</span>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="text-white/60 text-sm tracking-wide">Profit / Loss</span>
              <span className={`text-xl font-semibold ${profit >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                ₹{profit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#111] rounded-2xl p-8">
            <nav className="flex gap-8 border-b border-white/10 pb-4 mb-6">
              {[
                { key: "overview", label: "Overview" },
                { key: "buy", label: "Buy Gold" },
                { key: "sell", label: "Sell Gold" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-sm font-semibold pb-2 transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-[#0a0a0b] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Portfolio Trend</h3>
                  <span className="text-sm text-white/50">Last 7 days</span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                  <span className="inline-flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${profit >= 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
                    <span className={profit >= 0 ? "text-emerald-200" : "text-rose-200"}>
                      {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                    </span>
                  </span>
                  <span className="text-white/40">{gold.toFixed(3)}g</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <XAxis
  dataKey="name"
  tick={{ fill: "#888", fontSize: 12 }}
  axisLine={false}
  tickLine={false}
  interval="preserveStartEnd"
/>
                      <Tooltip
                        wrapperStyle={{ borderRadius: 10, border: "none", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}
                        contentStyle={{ background: "rgba(15, 15, 15, 0.95)", border: "1px solid rgba(255,255,255,0.1)", padding: 10 }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#FBBF24"
                        strokeWidth={2}
                        dot={false}
                        strokeLinecap="round"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <div className="space-y-3">
                  {sampleTransactions.map((tx) => (
                    <div
                      key={`${tx.date}-${tx.type}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#0a0a0b] p-4"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-white/50">{tx.date}</span>
                        <span className="text-base font-semibold text-white">{tx.amount}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === "Buy"
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-rose-500/15 text-rose-200"
                          }`}
                        >
                          {tx.type}
                        </span>
                        <span className="text-sm text-white/60">{tx.gold}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "buy" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Buy Gold</h3>
            <BuyGold />
          </div>
        )}

        {activeTab === "sell" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Sell Gold</h3>
            <SellGold />
          </div>
        )}
      </div>
    </div>
  );
}
