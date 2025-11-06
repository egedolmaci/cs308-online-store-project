import ContactInfo from "./components/ContactInfo";
import FAQ from "./components/FAQ";

const Contact = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
          <ContactInfo />
        </div>

        <FAQ />
      </div>
    </div>
  );
};

export default Contact;
