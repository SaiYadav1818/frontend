import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { fetchSafeGoldLiveRateSnapshot } from "../api/safeGoldApi";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

function GoldPriceChart() {
  const [chartData, setChartData] = useState([]);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadRates = async () => {
      const response = await fetchSafeGoldLiveRateSnapshot();

      if (!isMounted || !response?.history) {
        return;
      }

      setChartData(response.history || []);

      const history = response.history || [];
      if (history.length >= 2) {
        const first = history[0]?.price || 0;
        const last = history[history.length - 1]?.price || 0;
        if (first) {
          setPriceChange(((last - first) / first) * 100);
        }
      }
    };

    loadRates();

    const intervalId = window.setInterval(loadRates, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const chartRange = useMemo(() => {
    if (!chartData.length) {
      return [0, 100];
    }

    const prices = chartData.map((point) => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = Math.max((max - min) * 0.25, 5);

    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_38%),linear-gradient(180deg,_rgba(17,24,39,0.92),_rgba(8,8,8,0.98))] p-8">
      <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold">Price Trend</h3>
          <p className="text-gray-400 text-sm">
            Live backend rate samples
          </p>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-sm flex items-center gap-1 ${
            priceChange >= 0
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {priceChange >= 0 ? "Up" : "Down"} {Math.abs(priceChange).toFixed(2)}%
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 8, left: -20, bottom: 4 }}
          >
            <defs>
              <linearGradient id="goldBars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.75} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 6"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis
              domain={chartRange}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              width={88}
              tickFormatter={(value) =>
                currencyFormatter.format(Number(value) || 0).replace(".00", "")
              }
            />

            <Tooltip
              cursor={{
                stroke: "rgba(255,255,255,0.2)",
                strokeDasharray: "4 4"
              }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                color: "#fff",
                boxShadow: "0 18px 50px rgba(0,0,0,0.35)"
              }}
              labelStyle={{ color: "#cbd5e1", marginBottom: 6 }}
              formatter={(value) => `${formatCurrency(value)}/g`}
            />

            <Bar
              dataKey="price"
              fill="url(#goldBars)"
              radius={[8, 8, 2, 2]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GoldPriceChart;
