const Addresses = ({ addresses, onDeleteAddress }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
        <button className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95">
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300 relative"
          >
            {address.isDefault && (
              <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold bg-success text-white">
                Default
              </span>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-sand to-sage rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {address.type}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  {address.name}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-6">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-sand hover:text-sand hover:shadow-md transition-all duration-300 active:scale-95">
                Edit
              </button>
              <button
                onClick={() => onDeleteAddress(address.id)}
                className="flex-1 px-4 py-2 rounded-xl border-2 border-error text-error font-semibold hover:bg-error hover:text-white hover:shadow-md transition-all duration-300 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
