const ProdcutMetaInfo = ({ product }) => {
  return (
    <div className="flex flex-col lg:flex-col gap-6 lg:gap-8 flex-1 mb-16">
      {/* Product Meta Info */}
      <div className="bg-white rounded-3xl p-6 space-y-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
          Product Details
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Model Number</span>
            <span className="font-semibold text-gray-900">{product.model}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Serial Number</span>
            <span className="font-semibold text-gray-900">
              {product.serialNumber}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Warranty</span>
            <span className="font-semibold text-gray-900">
              {product.warrantyStatus}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Distributor</span>
            <span className="font-semibold text-gray-900">
              {product.distributor}
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center space-y-2 hover:shadow-xl transition-shadow duration-300">
          <svg
            className="w-8 h-8 mx-auto text-success"
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
          <p className="text-xs font-semibold text-gray-700">
            Quality
            <br />
            Guaranteed
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center space-y-2 hover:shadow-xl transition-shadow duration-300">
          <svg
            className="w-8 h-8 mx-auto text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <p className="text-xs font-semibold text-gray-700">
            Secure
            <br />
            Payment
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center space-y-2 hover:shadow-xl transition-shadow duration-300">
          <svg
            className="w-8 h-8 mx-auto text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p className="text-xs font-semibold text-gray-700">
            Easy
            <br />
            Returns
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProdcutMetaInfo;
