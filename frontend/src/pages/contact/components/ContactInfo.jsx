const ContactInfo = () => {
  const contactDetails = [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
      title: "Email Us",
      details: ["support@fashionstore.com", "sales@fashionstore.com"],
      color: "from-sand to-sage",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      ),
      title: "Call Us",
      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"],
      color: "from-success-light to-success",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
      ),
      title: "Visit Us",
      details: ["123 Fashion Avenue", "New York, NY 10001"],
      color: "from-sage to-linen",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Weekend: 10AM - 4PM"],
      color: "from-warning-light to-warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex justify-center flex-col align-items-center text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600">
          Reach out to us through any of these channels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactDetails.map((detail, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 bg-linear-to-br ${detail.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {detail.icon}
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {detail.title}
                </h3>
                {detail.details.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">Follow Us</h3>
          <p className="text-white/80">
            Stay connected for the latest updates and fashion trends
          </p>
          <div className="flex justify-center gap-4">
            {["facebook", "instagram", "twitter", "pinterest"].map((social) => (
              <button
                key={social}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              >
                <span className="text-white font-semibold capitalize text-xs">
                  {social[0].toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
