import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ---------------- DATA ---------------- */

const liveGold = {
  purity: "24K",
  price: "₹6,520",
  unit: "gram",
  updated: "Just now"
};

const products = Array.from({ length: 21 }, (_, i) => ({
  id: i + 1,
  name: `Digital Gold Plan ${i + 1}`,
  price: "Live Price"
}));

const features = [
  {
    title: "24K 999.9 Purity",
    desc: "All gold investments are backed by high purity physical gold."
  },
  {
    title: "Secure Storage",
    desc: "Gold is stored in insured and professionally managed vaults."
  },
  {
    title: "Instant Liquidity",
    desc: "Buy and sell gold anytime at live market prices."
  }
];

/* ---------------- COMPONENT ---------------- */

export default function Products() {

  const navigate = useNavigate();

  const handleInvestClick = () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }

  };

  return (
    <div className="bg-black text-white">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="pt-20">

        {/* LIVE PRICE BAR */}
        <div className="bg-yellow-500 text-black py-3 text-center font-semibold">
          {liveGold.purity} Gold Price: {liveGold.price} / {liveGold.unit} • Updated {liveGold.updated}
        </div>

        {/* PRODUCTS SECTION */}
        <section className="py-28 px-6 lg:px-20 relative overflow-hidden">

          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-yellow-500 opacity-10 blur-[200px] rounded-full"></div>

          <div className="max-w-7xl mx-auto relative z-10">

            <p className="text-center text-yellow-400 tracking-widest font-semibold mb-4">
              OUR PRODUCTS
            </p>

            <h2 className="text-center text-4xl lg:text-5xl font-bold mb-4">
              Explore Our <span className="text-yellow-400">Gold Products</span>
            </h2>

            <p className="text-center text-gray-400 mb-16">
              Secure and flexible digital gold investment options
            </p>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-b from-[#141414] to-[#0b0b0b] border border-gray-800 rounded-3xl p-10 hover:border-yellow-500/40 transition duration-300 text-center"
                >

                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-yellow-500 text-black mx-auto mb-6 shadow-[0_0_30px_rgba(255,200,0,0.5)]">
                    <Coins size={28} />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-yellow-400 font-semibold mb-6">
                    {product.price}
                  </p>

                  <button
                    onClick={handleInvestClick}
                    className="w-full bg-yellow-500 text-black py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
                  >
                    Invest Now
                  </button>

                </motion.div>
              ))}

            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 px-6 lg:px-20 bg-[#0b0b0b]">

          <div className="max-w-6xl mx-auto text-center">

            <h2 className="text-4xl font-bold mb-12">
              Why Invest in <span className="text-yellow-400">Digital Gold</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-10">

              {features.map((feature, i) => (
                <div key={i}>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="py-28 px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">
            Start Investing in <span className="text-yellow-400">Gold Today</span>
          </h2>

          <p className="text-gray-400 mb-8">
            Secure your wealth with trusted digital gold investments
          </p>

          <button
            onClick={handleInvestClick}
            className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
          >
            Start Investing
          </button>

        </section>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}