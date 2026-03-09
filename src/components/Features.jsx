import React from "react";

function Features() {
  const features = [
    {
      icon: "📈",
      title: "Real-Time Gold Prices",
      desc: "Monitor gold prices 24/7 with live updates.",
    },
    {
      icon: "🔐",
      title: "Secure Storage",
      desc: "Bank-grade vault security for your gold.",
    },
    {
      icon: "⚡",
      title: "Instant Buy/Sell",
      desc: "Trade gold instantly at live market prices.",
    },
    {
      icon: "💰",
      title: "Low Investment",
      desc: "Start investing with as little as ₹10.",
    },
    {
      icon: "🔍",
      title: "Transparent Fees",
      desc: "No hidden charges or commissions.",
    },
    {
      icon: "📱",
      title: "Mobile Access",
      desc: "Manage investments anywhere.",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-black/50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Platform Features
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)]"
            >
              <div className="text-3xl mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-white/70">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Features;