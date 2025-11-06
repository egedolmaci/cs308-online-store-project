import Story from "./components/Story";
import Values from "./components/Values";
import Stats from "./components/Stats";
import Team from "./components/Team";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center flex-col align-items-center text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-2">About Us</h2>
          <p className="text-gray-600">
            Learn more about our journey, values, and the team behind the
            fashion.
          </p>
        </div>

        <Story />
        <Values />
        <Stats />
        <Team />

        {/* CTA Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-sand/20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated collection of fashion-forward pieces that will
            elevate your style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/store"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 active:scale-95 shadow-lg min-w-[200px]"
            >
              <svg
                className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Shop Now</span>
            </Link>

            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 active:scale-95 shadow-lg border-2 border-gray-900 min-w-[200px]"
            >
              <svg
                className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
