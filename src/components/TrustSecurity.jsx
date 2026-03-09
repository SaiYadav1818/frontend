import React from "react";

function TrustSecurity() {
  const features = [
    {
      icon: "🏆",
      title: "24K 99.99% Purity",
      desc: "Invest in the purest gold available, verified by independent assayers.",
    },
    {
      icon: "🔒",
      title: "Secure Vault Storage",
      desc: "Bank-grade security with your gold stored in certified vaults worldwide.",
    },
    {
      icon: "🛡️",
      title: "Fully Insured",
      desc: "Your investment is completely protected with comprehensive insurance coverage.",
    },
    {
      icon: "📊",
      title: "Transparent Pricing",
      desc: "Real-time market prices with no hidden fees or commissions.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-black/50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Trust & Security
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Every aspect of your investment is protected with industry-leading security and transparency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-black border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.25)]">

                {/* Icon */}
                <div className="text-3xl mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/70">{feature.desc}</p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default TrustSecurity;