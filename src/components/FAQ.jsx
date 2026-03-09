import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is digital gold safe?",
      answer: "Yes, digital gold is backed by physical gold stored in secure vaults.",
    },
    {
      question: "Can I sell anytime?",
      answer: "Yes, you can sell gold anytime at market price.",
    },
    {
      question: "Is my investment insured?",
      answer: "Yes, all gold holdings are fully insured.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-32 bg-black/50">
      <div className="max-w-4xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-white/10 rounded-xl p-6 mb-4"
          >
            <button
              className="w-full text-left text-white font-semibold flex justify-between items-center"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>

            {openIndex === index && (
              <p className="text-white/70 mt-3">
                {faq.answer}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}

export default FAQ;