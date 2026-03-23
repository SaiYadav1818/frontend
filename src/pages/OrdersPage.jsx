import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserProfile } from "../api/authApi";
import {
  fetchAugmontBuyInvoice,
  fetchAugmontBuyOrderDetail,
  fetchAugmontBuyOrders,
  fetchAugmontSellInvoice,
  fetchAugmontSellOrderDetail,
  fetchAugmontSellOrders,
  getAugmontOrderReferences,
  getAugmontSession,
  getAugmontUser
} from "../api/augmontApi";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));
const formatGrams = (value) => `${Number(value || 0).toFixed(4)} g`;

const formatDate = (value) => {
  if (!value) return "NA";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getOrderKey = (order) =>
  order?.merchantTransactionId || order?.transactionId || order?.id;

const prettyJson = (value) => JSON.stringify(value || {}, null, 2);

const getEmptyStateMessage = (filter) => {
  if (filter === "SELL") return "No sell orders found.";
  if (filter === "BUY") return "No buy orders found.";
  return "No Augmont orders found.";
};

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState("");
  const [invoiceLoadingId, setInvoiceLoadingId] = useState("");

  const profile = getUserProfile();
  const augmontUser = getAugmontUser();
  const session = getAugmontSession();
  const storedReferences = getAugmontOrderReferences();
  const uniqueId =
    profile?.uniqueId || augmontUser?.uniqueId || storedReferences[0]?.uniqueId || "";
  const merchantId = session?.merchantId || storedReferences[0]?.merchantId || "11692";

  const loadOrders = useCallback(async () => {
    if (!uniqueId) {
      setOrders([]);
      setError("Missing Augmont uniqueId. Sign in with an Augmont-linked account to load order history.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    const [buyResponse, sellResponse] = await Promise.all([
      fetchAugmontBuyOrders({ merchantId, uniqueId }),
      fetchAugmontSellOrders({ merchantId, uniqueId })
    ]);

    if (!buyResponse.ok && !sellResponse.ok) {
      setError(
        buyResponse.message ||
          sellResponse.message ||
          "Unable to fetch Augmont order history"
      );
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const combinedOrders = [
      ...(buyResponse.orders || []),
      ...(sellResponse.orders || [])
    ].sort((a, b) => {
      const first = new Date(b?.date || 0).getTime();
      const second = new Date(a?.date || 0).getTime();
      return first - second;
    });

    setOrders(combinedOrders);
    setIsLoading(false);
  }, [merchantId, uniqueId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadOrders]);

  const filteredOrders = useMemo(
    () =>
      filter === "ALL"
        ? orders
        : orders.filter((order) => order.type === filter),
    [filter, orders]
  );

  const fetchOrderDetail = async (order) => {
    const orderKey = getOrderKey(order);
    if (!orderKey) return;

    setDetailLoadingId(orderKey);
    setSelectedOrderId(orderKey);
    setSelectedInvoice(null);

    const response =
      order.type === "BUY"
        ? await fetchAugmontBuyOrderDetail({
            merchantId,
            merchantTransactionId: order.merchantTransactionId,
            uniqueId: order.uniqueId || uniqueId
          })
        : await fetchAugmontSellOrderDetail({
            merchantId,
            merchantTransactionId: order.merchantTransactionId,
            uniqueId: order.uniqueId || uniqueId
          });

    setDetailLoadingId("");

    if (!response.ok) {
      setSelectedOrderDetail({
        error: response.message || "Unable to fetch order detail"
      });
      return;
    }

    setSelectedOrderDetail(response.order || {});
  };

  const fetchInvoice = async (order) => {
    const orderKey = getOrderKey(order);
    if (!orderKey || !order.transactionId) return;

    setInvoiceLoadingId(orderKey);
    setSelectedOrderId(orderKey);

    const response =
      order.type === "BUY"
        ? await fetchAugmontBuyInvoice({
            merchantId,
            transactionId: order.transactionId
          })
        : await fetchAugmontSellInvoice({
            merchantId,
            transactionId: order.transactionId
          });

    setInvoiceLoadingId("");

    if (!response.ok) {
      setSelectedInvoice({
        error: response.message || "Unable to fetch invoice"
      });
      return;
    }

    setSelectedInvoice(response.invoice || {});
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-28">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-sm text-white/55">
              Augmont buy and sell history loaded through backend wrapper list APIs.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/55">
            <p>Merchant ID: {merchantId || "NA"}</p>
            <p className="mt-1">Unique ID: {uniqueId || "NA"}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          {["ALL", "BUY", "SELL"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full border px-5 py-2 ${
                filter === item
                  ? "bg-yellow-400 text-black"
                  : "border-white/20 text-white"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={loadOrders}
            className="rounded-full border border-white/20 px-5 py-2 text-white transition hover:border-yellow-400 hover:text-yellow-300"
          >
            Refresh Orders
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-[#111] p-8 text-center text-gray-400">
            Loading Augmont orders...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 rounded-xl bg-yellow-500 px-6 py-2 text-black"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111] p-8 text-center text-gray-400">
            {getEmptyStateMessage(filter)}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="hidden grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_1fr_0.9fr_1.4fr] gap-4 bg-white/10 px-4 py-4 text-left text-sm md:grid">
              <div>Order ID</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Gold</div>
              <div>Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            <div className="divide-y divide-white/10">
              {filteredOrders.map((order) => {
                const orderKey = getOrderKey(order);
                const isActive = selectedOrderId === orderKey;

                return (
                  <div key={orderKey} className="px-4 py-4 hover:bg-white/5">
                    <div className="grid gap-3 md:grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_1fr_0.9fr_1.4fr] md:items-center">
                      <div>
                        <p className="text-xs text-white/45 md:hidden">Order ID</p>
                        <p className="break-all text-sm text-white">
                          {order.merchantTransactionId || order.transactionId || order.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/45 md:hidden">Type</p>
                        <p
                          className={
                            order.type === "BUY" ? "text-green-400" : "text-red-400"
                          }
                        >
                          {order.type}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-white/45 md:hidden">Amount</p>
                        <p>{formatCurrency(order.amount)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-white/45 md:hidden">Gold</p>
                        <p>{formatGrams(order.gold)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-white/45 md:hidden">Date</p>
                        <p className="text-sm text-white/70">{formatDate(order.date)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-white/45 md:hidden">Status</p>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => fetchOrderDetail(order)}
                          disabled={detailLoadingId === orderKey}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/80 transition hover:border-yellow-500/30 hover:text-yellow-300 disabled:opacity-60"
                        >
                          {detailLoadingId === orderKey ? "Loading..." : "View Detail"}
                        </button>
                        <button
                          onClick={() => fetchInvoice(order)}
                          disabled={
                            invoiceLoadingId === orderKey || !order.transactionId
                          }
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/80 transition hover:border-cyan-500/30 hover:text-cyan-300 disabled:opacity-60"
                        >
                          {invoiceLoadingId === orderKey ? "Loading..." : "View Invoice"}
                        </button>
                      </div>
                    </div>

                    {isActive && (selectedOrderDetail || selectedInvoice) ? (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <p className="text-sm font-semibold text-white">
                            Order Detail Response
                          </p>
                          {selectedOrderDetail?.error ? (
                            <p className="mt-3 text-sm text-red-300">
                              {selectedOrderDetail.error}
                            </p>
                          ) : (
                            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-white/70">
                              {prettyJson(selectedOrderDetail)}
                            </pre>
                          )}
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <p className="text-sm font-semibold text-white">
                            Invoice Response
                          </p>
                          {selectedInvoice?.error ? (
                            <p className="mt-3 text-sm text-red-300">
                              {selectedInvoice.error}
                            </p>
                          ) : selectedInvoice ? (
                            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-white/70">
                              {prettyJson(selectedInvoice)}
                            </pre>
                          ) : (
                            <p className="mt-3 text-sm text-white/45">
                              Fetch invoice to view invoice response.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
