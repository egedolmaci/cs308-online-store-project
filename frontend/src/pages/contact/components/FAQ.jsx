import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in their original condition with tags attached. Free returns on all orders over $100.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. Express shipping is available and takes 2-3 business days. Free shipping on orders over $100.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. International shipping times vary by location, typically 10-15 business days.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for your convenience.",
    },
    {
      question: "How do I know what size to order?",
      answer:
        "Each product page includes a detailed size guide. If you're unsure, our customer service team is happy to help you find the perfect fit.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-sand/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600">
          Find quick answers to common questions
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-sand/50 transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="font-bold text-gray-900 pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-6 h-6 text-sand flex-shrink-0 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-linear-to-br from-linen to-cream rounded-2xl">
        <p className="text-gray-700 text-center">
          <span className="font-semibold">Still have questions?</span> Our
          customer service team is here to help!{" "}
          <button className="text-sand font-bold hover:text-sage transition-colors">
            Contact us directly
          </button>
        </p>
      </div>
    </div>
  );
};

export default FAQ;
