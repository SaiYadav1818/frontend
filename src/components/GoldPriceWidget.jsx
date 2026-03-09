import React from "react";

function GoldPriceWidget() {
  return (
    <section id="gold-prices" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-yellow-400 font-semibold mb-2">
            MARKET DATA
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Live Gold Prices
          </h2>

          <p className="text-white/70">
            Real-time market data for informed investment decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Price Cards */}
          <div className="space-y-6">

            <div className="bg-black border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-1">
                Current Price
              </h3>

              <p className="text-white/50 text-sm mb-2">
                24K Gold (1g)
              </p>

              <div className="text-3xl font-bold text-yellow-400">
                ₹6,845
              </div>

              <p className="text-green-400 text-sm">
                +0.45%
              </p>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-1">
                Buy Price
              </h3>

              <p className="text-white/50 text-sm mb-2">
                Including premium
              </p>

              <div className="text-3xl font-bold text-white">
                ₹6,875
              </div>

              <p className="text-white/40 text-sm">
                +₹30 premium
              </p>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-1">
                Sell Price
              </h3>

              <p className="text-white/50 text-sm mb-2">
                Market rate
              </p>

              <div className="text-3xl font-bold text-white">
                ₹6,815
              </div>

              <p className="text-white/40 text-sm">
                -₹30 discount
              </p>
            </div>

          </div>

          {/* Chart */}
          <div className="bg-black border border-white/10 rounded-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl">
                Price Trend
              </h3>

              <span className="text-green-400 text-sm">
                +0.45%
              </span>
            </div>

            <div className="flex items-end justify-between h-48">
              {[65,70,68,75,80,78,85,90,88,95,100,98].map((h, i) => (
                <div
                  key={i}
                  className="bg-yellow-400 w-2 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-3 text-center mt-6 text-white">
              <div>
                <p className="text-white/50 text-sm">24H High</p>
                <p className="font-bold">₹6,890</p>
              </div>

              <div>
                <p className="text-white/50 text-sm">24H Low</p>
                <p className="font-bold">₹6,780</p>
              </div>

              <div>
                <p className="text-white/50 text-sm">Volume</p>
                <p className="font-bold">2.4K</p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-10 flex-col sm:flex-row">
          <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-8 py-4 rounded-full">
            Buy Gold Now
          </button>

          <button className="flex-1 border border-yellow-400 text-yellow-400 px-8 py-4 rounded-full">
            Sell Gold
          </button>
        </div>

      </div>
    </section>
  );
}

export default GoldPriceWidget;