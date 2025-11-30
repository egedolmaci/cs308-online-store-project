import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  applyDiscount,
  selectDiscountStatus
} from "../../../store/slices/productsSlice";

const DiscountsManagement = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const discountStatus = useSelector(selectDiscountStatus);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountRate, setDiscountRate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const filteredProductIds = filteredProducts.map((p) => p.id);
    if (selectedProducts.length === filteredProductIds.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProductIds);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountRate || selectedProducts.length === 0) {
      alert("Please select products and enter a discount rate");
      return;
    }

    const discount = parseFloat(discountRate);
    if (discount <= 0 || discount > 100) {
      alert("Discount rate must be between 1 and 100");
      return;
    }

    try {
      await dispatch(
        applyDiscount({
          productIds: selectedProducts,
          discountRate: discount,
        })
      ).unwrap();

      setShowSuccessMessage(true);
      setSelectedProducts([]);
      setDiscountRate("");

      // Refresh products list to show updated prices
      dispatch(fetchProducts());

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      alert(error || "Failed to apply discount");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDiscountedPrice = (price) => {
    if (!discountRate) return price;
    const discount = parseFloat(discountRate) / 100;
    return price * (1 - discount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Discount Management
        </h2>
        <p className="text-gray-600">
          Set discounts on products and notify customers
        </p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-success-light/20 border border-success rounded-2xl p-4">
          <p className="text-success font-semibold">
            ✓ Discount applied successfully! Users with these products in their wishlist will be notified.
          </p>
        </div>
      )}

      {/* Discount Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Discount Rate (%)
            </label>
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="e.g., 20"
              min="1"
              max="100"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {selectedProducts.length} product(s) selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
            >
              {selectedProducts.length === filteredProducts.length ? "Deselect All" : "Select All"}
            </button>
            <button
              onClick={handleApplyDiscount}
              disabled={!discountRate || selectedProducts.length === 0 || discountStatus === "loading"}
              className="px-6 py-2 rounded-xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {discountStatus === "loading" ? "Applying..." : "Apply Discount"}
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Products</h3>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No products found</p>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              const discountedPrice = calculateDiscountedPrice(product.price);

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductToggle(product.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "border-sand bg-sand/5 shadow-md"
                      : "border-gray-200 hover:border-sand/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-sand bg-sand"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Product Image */}
                    {product.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
                    </div>

                    {/* Pricing */}
                    <div className="text-right">
                      {discountRate && isSelected ? (
                        <>
                          <p className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xl font-bold text-success">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-success font-semibold">
                            {discountRate}% OFF
                          </p>
                        </>
                      ) : (
                        <p className="text-xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsManagement;
