import React from "react";

function CTA() {
  return (
    <section className="py-32 bg-black">

      <div className="max-w-5xl mx-auto px-4">

        <div className="relative rounded-3xl border border-white/10 p-16 text-center overflow-hidden">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,193,7,0.25),transparent_70%)]"></div>

          {/* Content */}
          <div className="relative z-10">

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">

              Start Your Gold Journey
              <br />

              <span className="text-yellow-400">
                Today
              </span>

            </h2>

            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">

              Join lakhs of Indians who are building wealth with digital gold.
              Start investing from just ₹10.

            </p>

            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-10 py-4 rounded-full shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition">

              Start Investing Now →

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTA;