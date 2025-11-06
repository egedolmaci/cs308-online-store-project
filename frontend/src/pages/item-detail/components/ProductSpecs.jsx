const ProductSpecs = ({ product }) => {
  return (
    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-wider">
        Specifications & Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-stretch">
        {/* Left Column - Technical Specs */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Technical Details
          </h3>

          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="flex items-start gap-3 p-4 bg-sand/10 rounded-2xl">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Product ID</p>
                <p className="text-gray-600 text-sm">#{product.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-sand/10 rounded-2xl">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Model Number</p>
                <p className="text-gray-600 text-sm">{product.model}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-sand/10 rounded-2xl">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Serial Number</p>
                <p className="text-gray-600 text-sm">{product.serialNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-sand/10 rounded-2xl">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Category</p>
                <p className="text-gray-600 text-sm">{product.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-sand/10 rounded-2xl">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Distributor</p>
                <p className="text-gray-600 text-sm">{product.distributor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features & Benefits */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Features & Benefits
          </h3>

          <div className="space-y-4 h-full flex flex-col justify-center">
            <div className="flex items-start gap-3 p-4 bg-success/5 rounded-2xl border-2 border-success/20">
              <svg
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Premium Quality</p>
                <p className="text-gray-600 text-sm">
                  Made with high-quality materials for durability and comfort
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-success/5 rounded-2xl border-2 border-success/20">
              <svg
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Warranty Coverage</p>
                <p className="text-gray-600 text-sm">
                  {product.warrantyStatus} warranty for peace of mind
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-success/5 rounded-2xl border-2 border-success/20">
              <svg
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Customer Rated</p>
                <p className="text-gray-600 text-sm">
                  {product.rating} stars based on customer reviews
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-success/5 rounded-2xl border-2 border-success/20">
              <svg
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Easy Care</p>
                <p className="text-gray-600 text-sm">
                  Simple maintenance and care instructions included
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-success/5 rounded-2xl border-2 border-success/20">
              <svg
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-gray-600 text-sm">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-10 pt-8 border-t-2 border-gray-100">
        <div className="bg-linear-to-r from-sand/20 via-sage/20 to-sand/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Additional Information
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description} This product is carefully selected by our team
            to ensure the highest quality standards. All items are shipped with
            secure packaging and tracked delivery service. For any questions or
            concerns, our customer support team is available 24/7 to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
