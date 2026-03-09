import React from "react";

function MobileApp() {
  return (
    <section className="py-20 lg:py-32 bg-black/50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-6">

            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Experience SabPe Gold on Mobile
            </h2>

            <p className="text-white/70">
              Manage your gold investments anytime, anywhere with our mobile app.
            </p>

            {/* Features List */}
            <ul className="space-y-4 text-white/80">
              <li>📊 Real-time portfolio tracking</li>
              <li>💳 Instant buy/sell transactions</li>
              <li>📈 Investment analytics</li>
              <li>🔒 Secure biometric authentication</li>
            </ul>

            {/* Store Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold">
                📱 App Store
              </button>

              <button className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full">
                🤖 Google Play
              </button>
            </div>

          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center">

            <div className="bg-neutral-900 p-4 rounded-3xl shadow-xl w-72">

              <div className="bg-black p-6 rounded-2xl">

                {/* App Header */}
                <div className="text-yellow-400 font-bold mb-6">
                  SabPe Gold
                </div>

                {/* Portfolio Card */}
                <div className="bg-neutral-900 p-4 rounded-xl mb-4">
                  <p className="text-white/60 text-sm">
                    Portfolio Value
                  </p>

                  <p className="text-yellow-400 text-xl font-bold">
                    ₹12,450
                  </p>

                  <p className="text-green-400 text-sm">
                    +2.1% today
                  </p>
                </div>

                {/* Gold Owned */}
                <div className="bg-neutral-900 p-4 rounded-xl mb-4">
                  <p className="text-white/60 text-sm">
                    Gold Owned
                  </p>

                  <p className="text-white font-bold">
                    25.3 grams
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-yellow-400 text-black py-2 rounded-lg">
                    Buy
                  </button>

                  <button className="flex-1 bg-neutral-800 text-white py-2 rounded-lg">
                    Sell
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default MobileApp;