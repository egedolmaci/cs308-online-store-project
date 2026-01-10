import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  updateProduct,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../../store/slices/productsSlice";

const PriceManagement = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoadingProducts = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceValues, setPriceValues] = useState({});

  // Load products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Initialize price values when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialPriceValues = {};
      products.forEach((product) => {
        initialPriceValues[product.id] = product.price;
      });
      setPriceValues(initialPriceValues);
    }
  }, [products]);

  const handlePriceUpdate = async (productId) => {
    try {
      await dispatch(
        updateProduct({
          productId,
          productData: { price: parseFloat(priceValues[productId]) },
        })
      ).unwrap();
      setEditingPriceId(null);
      dispatch(fetchProducts());
    } catch (error) {
      alert(error || "Error updating price");
    }
  };

  const handlePriceChange = (productId, value) => {
    setPriceValues({
      ...priceValues,
      [productId]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Price Management
        </h2>
        <p className="text-gray-600">
          Update product prices for the sales catalog
        </p>
      </div>

      {/* Price Management Table */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Product Prices</h3>

        {productsError && (
          <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
            <p className="text-error font-medium">{productsError}</p>
          </div>
        )}

        {isLoadingProducts ? (
          <p className="text-center text-gray-500 py-8">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-sand to-sage text-white">
                  <th className="px-4 py-3 text-left rounded-tl-2xl">Product Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Model</th>
                  <th className="px-4 py-3 text-left">Current Price</th>
                  <th className="px-4 py-3 text-left rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === products.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{product.category}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{product.model}</td>
                    <td className="px-4 py-3">
                      {editingPriceId === product.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceValues[product.id]}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            className="w-28 px-3 py-2 rounded-xl border-2 border-sand focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingPriceId === product.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePriceUpdate(product.id)}
                            className="px-3 py-1 rounded-xl bg-success-light text-success font-semibold hover:bg-success hover:text-white transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPriceId(null);
                              setPriceValues({
                                ...priceValues,
                                [product.id]: product.price,
                              });
                            }}
                            className="px-3 py-1 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingPriceId(product.id)}
                          className="px-3 py-1 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
                        >
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceManagement;
