const Stats = () => {
  const stats = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
    },
    {
      number: "1000+",
      label: "Products",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      ),
    },
    {
      number: "99%",
      label: "Satisfaction Rate",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      number: "24/7",
      label: "Support",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
    },
  ];

  return (
    <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 shadow-2xl mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {stat.icon}
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-white">
                {stat.number}
              </p>
              <p className="text-sm md:text-base text-white/80 font-semibold">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
