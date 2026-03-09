import React from "react";

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">

        {/* Brand */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          SabPe Gold
        </h2>

        {/* Description */}
        <p className="text-white/60 mb-6">
          Your trusted digital gold investment platform.
        </p>

        {/* Copyright */}
        <p className="text-white/40 text-sm">
          © 2024 SabPe Gold. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;