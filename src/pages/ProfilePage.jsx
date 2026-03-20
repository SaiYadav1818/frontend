import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Rahul Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated ✅");
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-black border border-yellow-400/20 rounded-xl p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 text-black flex items-center justify-center rounded-full text-xl font-bold">
              R
            </div>

            <div>
              {editing ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black border px-3 py-1 rounded"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-black border px-3 py-1 rounded block mt-2"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <p className="text-white/60">{phone}</p>
                  <p className="text-white/40 text-sm">rahul@email.com</p>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 px-5 py-2 rounded-lg text-black"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-400 px-5 py-2 rounded-lg text-black"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/5 p-6 rounded-xl">
            <p className="text-white/60">Total Investment</p>
            <h3 className="text-2xl font-bold text-yellow-400">₹2,45,830</h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <p className="text-white/60">Gold Holdings</p>
            <h3 className="text-2xl font-bold">37.5g</h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl">
            <p className="text-white/60">KYC Status</p>
            <h3 className="text-green-400 font-semibold">Verified</h3>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white/5 p-6 rounded-xl mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

          <div className="space-y-3 text-white/70">
            <p>✅ Bought gold ₹5,000</p>
            <p>💰 Sold gold ₹2,000</p>
            <p>📈 Portfolio increased +2.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
}