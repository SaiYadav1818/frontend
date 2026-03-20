import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);

  const handlePasswordUpdate = () => {
    if (!password || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    alert("Password updated successfully ✅");
    setPassword("");
    setNewPassword("");
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* PASSWORD SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-white/20 px-4 py-3 rounded-lg outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-black border border-white/20 px-4 py-3 rounded-lg outline-none"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-5 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Update Password
          </button>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-white/60">
              Email & SMS alerts for transactions
            </p>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`px-5 py-2 rounded-full ${
              notifications
                ? "bg-green-500 text-black"
                : "bg-gray-600 text-white"
            }`}
          >
            {notifications ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Account Info</h2>

          <p className="text-white/70">Email: rahul@email.com</p>
          <p className="text-white/70">Phone: +91 98765 43210</p>
          <p className="text-green-400 mt-2">KYC Verified ✔</p>
        </div>
      </div>
    </div>
  );
}