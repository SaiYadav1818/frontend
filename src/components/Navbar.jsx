import React, { useState, useEffect } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="text-2xl font-bold text-yellow-400">
            AurumVault
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">

            <a href="#home" className="text-white/80 hover:text-yellow-400 transition">
              Home
            </a>

            <a href="#features" className="text-white/80 hover:text-yellow-400 transition">
              Features
            </a>

            <a href="#how-it-works" className="text-white/80 hover:text-yellow-400 transition">
              How It Works
            </a>

            <a href="#gold-prices" className="text-white/80 hover:text-yellow-400 transition">
              Gold Prices
            </a>

            <a href="#faq" className="text-white/80 hover:text-yellow-400 transition">
              FAQ
            </a>

            <a href="#contact" className="text-white/80 hover:text-yellow-400 transition">
              Contact
            </a>

            <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
              Start Investing
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-black border-t border-white/10 py-6 flex flex-col items-center space-y-6">

            <a href="#home" onClick={closeMenu} className="text-white text-lg">
              Home
            </a>

            <a href="#features" onClick={closeMenu} className="text-white text-lg">
              Features
            </a>

            <a href="#how-it-works" onClick={closeMenu} className="text-white text-lg">
              How It Works
            </a>

            <a href="#gold-prices" onClick={closeMenu} className="text-white text-lg">
              Gold Prices
            </a>

            <a href="#faq" onClick={closeMenu} className="text-white text-lg">
              FAQ
            </a>

            <a href="#contact" onClick={closeMenu} className="text-white text-lg">
              Contact
            </a>

            <button
              onClick={closeMenu}
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold"
            >
              Start Investing
            </button>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;