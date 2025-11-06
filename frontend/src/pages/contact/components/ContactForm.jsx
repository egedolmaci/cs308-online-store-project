import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-sand/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Send Us a Message
        </h2>
        <p className="text-gray-600">
          Fill out the form below and we'll get back to you within 24 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subject <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Tell us more about your inquiry..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 active:scale-95 shadow-lg"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
