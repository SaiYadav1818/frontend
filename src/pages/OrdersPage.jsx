import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MyOrders() {
  const [filter, setFilter] = useState("ALL");

  const orders = [
    {
      id: "ORD12345",
      type: "BUY",
      amount: "₹5,000",
      gold: "0.76g",
      date: "20 Mar 2026",
      status: "Completed",
    },
    {
      id: "ORD12346",
      type: "SELL",
      amount: "₹2,500",
      gold: "0.38g",
      date: "18 Mar 2026",
      status: "Pending",
    },
  ];

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter(o => o.type === filter);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {/* FILTER */}
        <div className="flex gap-4 mb-6">
          {["ALL", "BUY", "SELL"].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-full border ${
                filter === item
                  ? "bg-yellow-400 text-black"
                  : "border-white/20 text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4">Order ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Gold</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">{order.id}</td>
                  <td className={order.type === "BUY" ? "text-green-400" : "text-red-400"}>
                    {order.type}
                  </td>
                  <td>{order.amount}</td>
                  <td>{order.gold}</td>
                  <td>{order.date}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}