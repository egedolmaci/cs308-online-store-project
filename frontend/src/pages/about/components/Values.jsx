const Values = () => {
  const values = [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      ),
      title: "Quality First",
      description:
        "Every item is carefully inspected to ensure it meets our high standards of quality and craftsmanship.",
      color: "from-sand to-sage",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        />
      ),
      title: "Sustainable Fashion",
      description:
        "We're committed to eco-friendly practices and working with suppliers who share our environmental values.",
      color: "from-success-light to-success",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
      title: "Customer Focused",
      description:
        "Your satisfaction is our priority. We offer hassle-free returns and responsive customer support.",
      color: "from-sage to-linen",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping to get your favorite styles to your doorstep as soon as possible.",
      color: "from-warning-light to-warning",
    },
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Values
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The principles that guide everything we do
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start gap-6">
              <div
                className={`w-16 h-16 bg-linear-to-br ${value.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {value.icon}
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Values;
