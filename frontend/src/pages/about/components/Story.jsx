const Story = () => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-sand/20 mb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Story
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-sand to-sage rounded-full"></div>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p className="text-lg">
            Welcome to our fashion destination, where style meets comfort and
            quality meets affordability. Founded with a passion for bringing the
            latest trends to fashion enthusiasts everywhere, we've grown from a
            small startup to a trusted name in online fashion retail.
          </p>

          <p className="text-lg">
            Our journey began with a simple belief: everyone deserves access to
            high-quality, stylish clothing that makes them feel confident and
            comfortable. Today, we curate a diverse collection of apparel that
            caters to every style, occasion, and personality.
          </p>

          <p className="text-lg">
            We're committed to sustainable fashion practices, ethical sourcing,
            and providing exceptional customer service. Every piece in our
            collection is carefully selected to ensure it meets our high
            standards of quality and style.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;
