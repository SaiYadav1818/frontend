import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { fetchAugmontRateHistory } from "../api/augmontApi";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

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

const formatReturn = (value) => {
  if (value === null || value === undefined || value === "") return "NA";
  return `${value}%`;
};

function GoldPriceChart() {
  const defaultRange = getDateRange();
  const [metalType, setMetalType] = useState("gold");
  const [historyRows, setHistoryRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const response = await fetchAugmontRateHistory({
      fromDate: appliedRange.fromDate,
      toDate: appliedRange.toDate,
      metalType
    });

    if (!response?.ok) {
      setHistoryRows([]);
      setError(response?.message || "Unable to fetch Augmont rate history");
      setIsLoading(false);
      return;
    }

    setHistoryRows(response.history || []);
    setIsLoading(false);
  }, [appliedRange.fromDate, appliedRange.toDate, metalType]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadHistory();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadHistory]);

  const handleApplyRange = () => {
    if (!fromDate || !toDate) {
      setError("Select both from and to dates.");
      return;
    }

    if (fromDate > toDate) {
      setError("From date cannot be later than to date.");
      return;
    }

    setAppliedRange({
      fromDate,
      toDate
    });
  };

  const handleResetRange = () => {
    const nextRange = getDateRange();
    setFromDate(nextRange.fromDate);
    setToDate(nextRange.toDate);
    setAppliedRange(nextRange);
  };

  const chartData = useMemo(
    () =>
      historyRows.map((row) => ({
        label: row.date,
        buyRate: row.buyRate,
        sellRate: row.sellRate
      })),
    [historyRows]
  );

  const priceChange = useMemo(() => {
    if (historyRows.length < 2) return 0;

    const first = historyRows[0]?.buyRate || 0;
    const last = historyRows[historyRows.length - 1]?.buyRate || 0;

    if (!first) return 0;
    return ((last - first) / first) * 100;
  }, [historyRows]);

  const chartRange = useMemo(() => {
    if (!historyRows.length) {
      return [0, 100];
    }

    const prices = historyRows.flatMap((point) => [point.buyRate, point.sellRate]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = Math.max((max - min) * 0.2, 5);

    return [Math.max(0, min - padding), max + padding];
  }, [historyRows]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_38%),linear-gradient(180deg,_rgba(17,24,39,0.92),_rgba(8,8,8,0.98))] p-8">
        <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Rate History</h3>
            <p className="text-sm text-gray-400">
              Date-wise buy and sell rates from `payload.result.data`
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
              {["gold", "silver"].map((metal) => (
                <button
                  key={metal}
                  onClick={() => setMetalType(metal)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    metalType === metal
                      ? "bg-yellow-500 text-black"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {metal}
                </button>
              ))}
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
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_1fr_auto_auto]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              From
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              max={toDate}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              To
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              min={fromDate}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500/40"
            />
          </label>

          <button
            onClick={handleApplyRange}
            className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
          >
            Apply
          </button>

          <button
            onClick={handleResetRange}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/75 transition hover:border-yellow-500/30 hover:text-white"
          >
            Reset
          </button>
        </div>

        {isLoading ? (
          <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-black/20" />
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 px-6 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={loadHistory}
              className="mt-4 rounded-xl bg-yellow-500 px-5 py-2 text-sm font-semibold text-black"
            >
              Retry history
            </button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm text-white/50">
            No historical rates found.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 8, left: -20, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="buyBars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="sellBars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.75} />
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
                  formatter={(value, name) => [
                    `${formatCurrency(value)}/unit`,
                    name === "buyRate" ? "Buy Rate" : "Sell Rate"
                  ]}
                />
                <Legend />

                <Bar
                  dataKey="buyRate"
                  fill="url(#buyBars)"
                  radius={[8, 8, 2, 2]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="sellRate"
                  fill="url(#sellBars)"
                  radius={[8, 8, 2, 2]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f]">
        <div className="border-b border-white/10 px-6 py-4">
          <h4 className="text-lg font-semibold text-white">Historical Rate Rows</h4>
          <p className="mt-1 text-sm text-white/50">
            Buy, sell, and return percentages with nullable long-term values handled safely.
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-white/50">Loading history rows...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-300">{error}</div>
        ) : historyRows.length === 0 ? (
          <div className="p-6 text-sm text-white/50">No historical rows available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Buy</th>
                  <th className="px-4 py-3">Sell</th>
                  <th className="px-4 py-3">1D</th>
                  <th className="px-4 py-3">1W</th>
                  <th className="px-4 py-3">1M</th>
                  <th className="px-4 py-3">3M</th>
                  <th className="px-4 py-3">6M</th>
                  <th className="px-4 py-3">9M</th>
                  <th className="px-4 py-3">1Y</th>
                  <th className="px-4 py-3">2Y</th>
                  <th className="px-4 py-3">3Y</th>
                  <th className="px-4 py-3">4Y</th>
                  <th className="px-4 py-3">5Y</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => (
                  <tr key={`${row.date}-${row.metalType}`} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{row.date}</td>
                    <td className="px-4 py-3 text-white/70">{row.metalType}</td>
                    <td className="px-4 py-3 text-yellow-300">
                      {formatCurrency(row.buyRate)}
                    </td>
                    <td className="px-4 py-3 text-cyan-300">
                      {formatCurrency(row.sellRate)}
                    </td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.oneDay)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.oneWeek)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.oneMonth)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.threeMonth)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.sixMonth)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.nineMonth)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.oneYear)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.twoYear)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.threeYear)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.fourYear)}</td>
                    <td className="px-4 py-3 text-white/60">{formatReturn(row.returns.fiveYear)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoldPriceChart;
