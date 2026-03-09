import React from "react";

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Investor",
      rating: 5,
      text: "SabPe Gold made investing extremely simple and secure.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Portfolio Manager",
      rating: 5,
      text: "Reliable platform with real-time pricing.",
      avatar: "MC",
    },
    {
      name: "Emma Davis",
      role: "Financial Advisor",
      rating: 5,
      text: "Excellent mobile experience and transparency.",
      avatar: "ED",
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-black border border-white/10 rounded-2xl p-8 text-center shadow-lg transition hover:scale-105 hover:shadow-yellow-500/30"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mx-auto mb-4">
                {t.avatar}
              </div>

              {/* Testimonial Text */}
              <p className="text-white/80 italic mb-4">
                "{t.text}"
              </p>

              {/* Name & Role */}
              <div className="font-semibold text-white">{t.name}</div>
              <div className="text-sm text-white/60">{t.role}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;