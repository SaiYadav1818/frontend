import React from "react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Account",
      desc: "Sign up in minutes with secure verification and KYC process.",
      icon: "👤",
    },
    {
      number: "02",
      title: "Add Funds",
      desc: "Deposit money via bank transfer, card, or digital wallet.",
      icon: "💳",
    },
    {
      number: "03",
      title: "Buy Digital Gold",
      desc: "Purchase gold at current market rates with instant execution.",
      icon: "🪙",
    },
    {
      number: "04",
      title: "Sell Anytime",
      desc: "Convert back to cash whenever you want at competitive rates.",
      icon: "📈",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            How It Works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">

              <div className="bg-black border border-white/10 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 hover:shadow-yellow-500/20">

                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                  {step.number}
                </div>

                <div className="pt-8">

                  {/* Icon */}
                  <div className="text-3xl mb-4 group-hover:scale-110 transition">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70">
                    {step.desc}
                  </p>

                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;