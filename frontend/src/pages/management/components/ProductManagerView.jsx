import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct as createProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../../store/slices/productsSlice";
import {
  fetchCategories,
  createCategory as createCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../../store/slices/categoriesSlice";
import {
  getPendingReviews,
  approveReview,
  selectPendingReviews,
  selectReviewsLoading,
  selectReviewsError,
} from "../../../store/slices/reviewsSlice";

const ProductManagerView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("products");

  // Redux state
  const products = useSelector(selectProducts);
  const isLoadingProducts = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);

  const categories = useSelector(selectCategories);
  const isLoadingCategories = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const pendingReviews = useSelector(selectPendingReviews);
  const isLoadingReviews = useSelector(selectReviewsLoading);
  const reviewsError = useSelector(selectReviewsError);

  // Products State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    cost_price: "",
    stock: "",
    description: "",
  });

  // Categories State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  // Load initial data
  useEffect(() => {
    if (activeTab === "products") {
      dispatch(fetchProducts());
    } else if (activeTab === "categories") {
      dispatch(fetchCategories());
    } else if (activeTab === "comments") {
      dispatch(getPendingReviews());
    }
  }, [activeTab, dispatch]);

  // Product Functions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await dispatch(
          updateProductAction({
            productId: editingProduct.id,
            productData: productForm,
          })
        ).unwrap();
      } else {
        await dispatch(createProductAction(productForm)).unwrap();
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "",
        price: "",
        cost_price: "",
        stock: "",
        description: "",
      });
      dispatch(fetchProducts());
    } catch (error) {
      alert(error || "Error saving product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      cost_price: product.cost_price || "",
      stock: product.stock,
      description: product.description || "",
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProductAction(productId)).unwrap();
        dispatch(fetchProducts());
      } catch (error) {
        alert(error || "Error deleting product");
      }
    }
  };

  // Category Functions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await dispatch(
          updateCategoryAction({
            categoryId: editingCategory.id,
            categoryData: categoryForm,
          })
        ).unwrap();
      } else {
        await dispatch(createCategoryAction(categoryForm)).unwrap();
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "" });
      dispatch(fetchCategories());
    } catch (error) {
      alert(error || "Error saving category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || "" });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategoryAction(categoryId)).unwrap();
        dispatch(fetchCategories());
      } catch (error) {
        alert(error || "Error deleting category");
      }
    }
  };

  // Comment Functions
  const handleApproveComment = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
    } catch (error) {
      alert(error || "Error approving review");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Management
        </h2>
        <p className="text-gray-600">
          Manage products, categories, and moderate comments
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg border border-sand/20">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "products"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "categories"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "comments"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Products</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: "",
                  category: "",
                  price: "",
                  cost_price: "",
                  stock: "",
                  description: "",
                });
                setShowProductModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Product
            </button>
          </div>

          {productsError && (
            <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
              <p className="text-error font-medium">{productsError}</p>
            </div>
          )}

          {isLoadingProducts ? (
            <p className="text-center text-gray-500 py-8">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Price: ${product.price}</p>
                      {product.cost_price && (
                        <p className="text-sm text-gray-600">Cost: ${product.cost_price}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-error text-error font-semibold hover:bg-error hover:text-white transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Categories</h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: "", description: "" });
                setShowCategoryModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Category
            </button>
          </div>

          {categoriesError && (
            <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
              <p className="text-error font-medium">{categoriesError}</p>
            </div>
          )}

          {isLoadingCategories ? (
            <p className="text-center text-gray-500 py-8">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-error text-error font-semibold hover:bg-error hover:text-white transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "comments" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Review Moderation
          </h3>

          {reviewsError && (
            <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
              <p className="text-error font-medium">{reviewsError}</p>
            </div>
          )}

          {isLoadingReviews ? (
            <p className="text-center text-gray-500 py-8">Loading reviews...</p>
          ) : pendingReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No pending reviews to moderate
            </p>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sand/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user_name || "Anonymous"}</h4>
                      <p className="text-sm text-gray-500">
                        Product ID: {review.product_id} • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-warning" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveComment(review.id)}
                      className="flex-1 px-4 py-2 rounded-xl bg-success-light text-success font-semibold hover:bg-success hover:text-white transition-all duration-300"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cost Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.cost_price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, cost_price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-lg transition-all duration-300"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-lg transition-all duration-300"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagerView;
