import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  applyDiscount,
  selectDiscountStatus,
  clearDiscount,
  selectClearDiscountStatus
} from "../../../store/slices/productsSlice";

const DiscountsManagement = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const discountStatus = useSelector(selectDiscountStatus);
  const clearDiscountStatus = useSelector(selectClearDiscountStatus);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountRate, setDiscountRate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("apply"); // 'apply' | 'remove'

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

  const handleRemoveDiscount = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select products to remove discount from");
      return;
    }

    try {
      await dispatch(clearDiscount(selectedProducts)).unwrap();

      setShowSuccessMessage(true);
      setSelectedProducts([]);

      // Refresh products list to show updated prices
      dispatch(fetchProducts());

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      alert(error || "Failed to remove discount");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // For remove tab, only show products with active discounts
    if (activeTab === "remove") {
      return matchesSearch && product.discount_active;
    }

    return matchesSearch;
  });

  const calculateDiscountedPrice = (price) => {
    if (!discountRate) return price;
    const discount = parseFloat(discountRate) / 100;
    return price * (1 - discount);
  };

  const hasActiveDiscounts = products.some(p => p.discount_active);

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

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg border border-sand/20">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("apply");
              setSelectedProducts([]);
              setDiscountRate("");
            }}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "apply"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Apply Discount
          </button>
          <button
            onClick={() => {
              setActiveTab("remove");
              setSelectedProducts([]);
              setDiscountRate("");
            }}
            disabled={!hasActiveDiscounts}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "remove"
                ? "bg-linear-to-br from-error to-warning text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            Remove Discount {hasActiveDiscounts && `(${products.filter(p => p.discount_active).length})`}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-success-light/20 border border-success rounded-2xl p-4">
          <p className="text-success font-semibold">
            {activeTab === "apply"
              ? "✓ Discount applied successfully! Users with these products in their wishlist will be notified."
              : "✓ Discount removed successfully!"}
          </p>
        </div>
      )}

      {/* Discount Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {activeTab === "apply" ? "Apply Discount to Products" : "Remove Discount from Products"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={activeTab === "apply" ? "md:col-span-2" : "md:col-span-3"}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === "apply" ? "Search by product name..." : "Search discounted products..."}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>

          {activeTab === "apply" && (
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
          )}
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
            {activeTab === "apply" ? (
              <button
                onClick={handleApplyDiscount}
                disabled={!discountRate || selectedProducts.length === 0 || discountStatus === "loading"}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {discountStatus === "loading" ? "Applying..." : "Apply Discount"}
              </button>
            ) : (
              <button
                onClick={handleRemoveDiscount}
                disabled={selectedProducts.length === 0 || clearDiscountStatus === "loading"}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-error to-warning text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearDiscountStatus === "loading" ? "Removing..." : "Remove Discount"}
              </button>
            )}
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
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.discount_active && !isSelected && (
                          <div className="absolute inset-0 bg-success/90 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {product.discount_rate}%
                            </span>
                          </div>
                        )}
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
                            {discountRate}% OFF (Preview)
                          </p>
                        </>
                      ) : product.discount_active ? (
                        <>
                          <p className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xl font-bold text-success">
                            ${product.final_price.toFixed(2)}
                          </p>
                          <p className="text-xs text-success font-semibold">
                            {product.discount_rate}% OFF (Active)
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
