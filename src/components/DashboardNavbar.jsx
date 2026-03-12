import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardNavbar({ activeTab, setActiveTab }) {

  const navigate = useNavigate();

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "portfolio", label: "Portfolio" },
    { id: "buy", label: "Buy Gold" },
    { id: "sell", label: "Sell Gold" },
  ];

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    navigate("/login");

  };

  const goHome = () => {

    navigate("/");

  };

  return (

    <div className="w-full bg-black border-b border-white/10 px-12 py-5 flex items-center justify-between">

      {/* Logo */}

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 bg-yellow-400 text-black font-bold flex items-center justify-center rounded-lg text-lg">
          SG
        </div>

        <h1 className="text-2xl font-bold">
          <span className="text-white">SabPe</span>
          <span className="text-yellow-400"> Gold</span>
        </h1>

      </div>

      {/* Tabs */}

      <div className="flex gap-12">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative text-lg font-semibold transition duration-300

            ${
              activeTab === tab.id
                ? "text-yellow-400"
                : "text-white/70 hover:text-yellow-400"
            }`}
          >

            {tab.label}

            <span
              className={`absolute left-0 -bottom-2 h-[3px] bg-yellow-400 transition-all duration-300
              
              ${
                activeTab === tab.id
                  ? "w-full"
                  : "w-0"
              }`}
            />

          </button>

        ))}

      </div>

      {/* Right Buttons */}

      <div className="flex gap-4">

        <button
          onClick={goHome}
          className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition"
        >
          ← Home
        </button>

        <button
          onClick={handleLogout}
          className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:scale-105 transition"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default DashboardNavbar;