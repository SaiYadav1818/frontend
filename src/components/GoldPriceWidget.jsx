"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  fetchAugmontRateHistory,
  fetchAugmontSipRates,
  fetchLiveGoldRateSnapshot
} from "../api/augmontApi";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const cardAnimation = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 }
  })
};

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const getDateRange = () => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - 20);

  return {
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate: toDate.toISOString().slice(0, 10)
  };
};

function GoldPriceWidget() {
  const [metalType, setMetalType] = useState("gold");
  const [chartData, setChartData] = useState([]);
  const [liveRates, setLiveRates] = useState({
    gold: { currentPrice: 0, buyPrice: 0, sellPrice: 0 },
    silver: { currentPrice: 0, buyPrice: 0, sellPrice: 0 },
    updatedAt: ""
  });
  const [sipRates, setSipRates] = useState({
    gold: { currentPrice: 0, buyPrice: 0 },
    silver: { currentPrice: 0, buyPrice: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRates = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const { fromDate, toDate } = getDateRange();
    const [liveResponse, historyResponse, sipResponse] = await Promise.all([
      fetchLiveGoldRateSnapshot(),
      fetchAugmontRateHistory({
        fromDate,
        toDate,
        metalType
      }),
      fetchAugmontSipRates()
    ]);

    if (!liveResponse?.ok && !historyResponse?.ok && !sipResponse?.ok) {
      setError(
        liveResponse?.message ||
          historyResponse?.message ||
          sipResponse?.message ||
          "Unable to load Augmont rates"
      );
      setChartData([]);
      setIsLoading(false);
      return;
    }

    if (liveResponse?.ok) {
      setLiveRates(liveResponse.snapshot);
    }

    if (historyResponse?.ok) {
      setChartData(historyResponse.history || []);
    } else {
      setChartData([]);
    }

    if (sipResponse?.ok) {
      setSipRates(sipResponse.snapshot);
    }

    setIsLoading(false);
  }, [metalType]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadRates();
    }, 0);

    const intervalId = window.setInterval(loadRates, 60000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [loadRates]);

  const selectedLiveRates = liveRates?.[metalType] || {};
  const selectedSipRate = sipRates?.[metalType]?.buyPrice || 0;

  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;

    const first = chartData[0]?.price || 0;
    const last = chartData[chartData.length - 1]?.price || 0;

    if (!first) return 0;
    return ((last - first) / first) * 100;
  }, [chartData]);

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

  const cards = [
    {
      title: `${metalType === "gold" ? "Gold" : "Silver"} Spot`,
      price: formatCurrency(selectedLiveRates.currentPrice || 0),
      sub: "/unit",
      extra: `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`,
      color: priceChange >= 0 ? "text-green-400" : "text-red-400"
    },
    {
      title: "Live Buy Rate",
      price: formatCurrency(selectedLiveRates.buyPrice || 0),
      sub: "/unit"
    },
    {
      title: "Live Sell Rate",
      price: formatCurrency(selectedLiveRates.sellPrice || 0),
      sub: "/unit"
    },
    {
      title: "SIP Rate",
      price: formatCurrency(selectedSipRate || 0),
      sub: "/unit",
      extra: "Augmont SIP"
    }
  ];

  return (
    <section className="bg-black py-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="font-semibold tracking-wider text-yellow-500">
            MARKET DATA
          </p>

          <h2 className="mt-2 text-4xl font-bold lg:text-5xl">
            Augmont <span className="text-yellow-400">Rates</span>
          </h2>

          <p className="mt-3 text-gray-400">
            Live, historical, and SIP rates from the backend wrapper APIs
          </p>
        </Motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-full border border-white/10 bg-[#111] p-1">
            {["gold", "silver"].map((metal) => (
              <button
                key={metal}
                onClick={() => setMetalType(metal)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  metalType === metal
                    ? "bg-yellow-500 text-black"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {metal}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-white/55">
            {liveRates.updatedAt ? <span>Updated live from backend</span> : null}
            <button
              onClick={loadRates}
              className="rounded-full border border-white/10 px-4 py-2 text-white/75 transition hover:border-yellow-500/30 hover:text-white"
            >
              Refresh Rates
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-3xl border border-white/10 bg-[#0f0f0f]"
                />
              ))}
            </div>
            <div className="h-[26rem] animate-pulse rounded-3xl border border-white/10 bg-[#0f0f0f]" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={loadRates}
              className="mt-4 rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black"
            >
              Retry Rates
            </button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              {cards.map((card, i) => (
                <Motion.div
                  key={card.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={cardAnimation}
                  className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-7 transition-all hover:border-yellow-500/30"
                >
                  <p className="mb-2 text-sm text-gray-400">{card.title}</p>

                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl font-bold lg:text-4xl">
                      {card.price}
                      <span className="ml-1 text-lg text-gray-400">
                        {card.sub}
                      </span>
                    </h3>

                    <span className={`text-sm ${card.color || "text-gray-400"}`}>
                      {card.extra}
                    </span>
                  </div>
                </Motion.div>
              ))}
            </div>

            <Motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_38%),linear-gradient(180deg,_rgba(17,24,39,0.92),_rgba(8,8,8,0.98))] p-8"
            >
              <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">History Trend</h3>
                  <p className="text-sm text-gray-400">
                    Augmont history API for {metalType}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-1 text-sm ${
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
                      formatter={(value) => `${formatCurrency(value)}/unit`}
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
            </Motion.div>
          </div>
        )}

        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex flex-col gap-6 sm:flex-row"
        >
          <button
            className="flex-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 font-semibold text-black transition hover:scale-105"
            onClick={() => {
              const isLoggedIn = localStorage.getItem("isLoggedIn");
              if (isLoggedIn === "true") {
                window.location.href = "/portfolio?tab=buy";
              } else {
                window.location.href = "/login";
              }
            }}
          >
            Buy Gold Now
          </button>

          <button
            className="flex-1 rounded-full border border-yellow-500 px-8 py-4 text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
            onClick={() => {
              const isLoggedIn = localStorage.getItem("isLoggedIn");
              if (isLoggedIn === "true") {
                window.location.href = "/portfolio?tab=sell";
              } else {
                window.location.href = "/login";
              }
            }}
          >
            Sell Gold
          </button>
        </Motion.div>
      </div>
    </section>
  );
}

export default GoldPriceWidget;
