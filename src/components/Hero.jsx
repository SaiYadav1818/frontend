import DashboardCard from "./DashboardCard";

function Hero() {
  return (
    <section id="home" className="pt-24 relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,193,7,0.15),transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">

            <div className="inline-flex items-center px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm">
              ↗ India's Trusted Digital Gold Platform
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">Invest in </span>
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Pure Digital Gold
              </span>
              <br />
              <span className="text-white">with SabPe</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Buy, sell, and securely store 24K 99.99% pure gold anytime with SabPe Gold. Start your wealth journey today.
            </p>

            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-semibold">
                Start Investing →
              </button>
              <button className="border border-white/20 text-white px-8 py-4 rounded-full">
                ▶ Learn More
              </button>
            </div>

            <div className="flex gap-12 pt-6">
              <div>
                <h3 className="text-3xl font-bold text-yellow-400">5L+</h3>
                <p className="text-white/50 text-sm">Active Investors</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-yellow-400">₹500Cr+</h3>
                <p className="text-white/50 text-sm">Gold Traded</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-yellow-400">4.9★</h3>
                <p className="text-white/50 text-sm">App Rating</p>
              </div>
            </div>

          </div>

          <DashboardCard />

        </div>
      </div>
    </section>
  );
}

export default Hero;