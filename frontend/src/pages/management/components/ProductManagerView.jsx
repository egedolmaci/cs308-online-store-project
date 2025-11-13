import { useState, useEffect } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchDeliveries,
  updateDeliveryStatus,
  fetchPendingComments,
  approveComment,
  disapproveComment,
} from "../../../api/mockAdminService";

const ProductManagerView = () => {
  const [activeTab, setActiveTab] = useState("products");

  // Products State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    salePrice: "",
    costPrice: "",
    stock: "",
    description: "",
  });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // Deliveries State
  const [deliveries, setDeliveries] = useState([]);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);

  // Comments State
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Load initial data
  useEffect(() => {
    if (activeTab === "products") {
      loadProducts();
    } else if (activeTab === "categories") {
      loadCategories();
    } else if (activeTab === "deliveries") {
      loadDeliveries();
    } else if (activeTab === "comments") {
      loadComments();
    }
  }, [activeTab]);

  // Product Functions
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      alert("Error loading products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
      } else {
        await createProduct(productForm);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "",
        salePrice: "",
        costPrice: "",
        stock: "",
        description: "",
      });
      loadProducts();
    } catch (error) {
      alert("Error saving product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      stock: product.stock,
      description: product.description,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        loadProducts();
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  // Category Functions
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      alert("Error loading categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", slug: "" });
      loadCategories();
    } catch (error) {
      alert("Error saving category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, slug: category.slug });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        loadCategories();
      } catch (error) {
        alert("Error deleting category");
      }
    }
  };

  // Delivery Functions
  const loadDeliveries = async () => {
    setIsLoadingDeliveries(true);
    try {
      const data = await fetchDeliveries();
      setDeliveries(data);
    } catch (error) {
      alert("Error loading deliveries");
    } finally {
      setIsLoadingDeliveries(false);
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      loadDeliveries();
    } catch (error) {
      alert("Error updating delivery status");
    }
  };

  // Comment Functions
  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const data = await fetchPendingComments();
      setComments(data);
    } catch (error) {
      alert("Error loading comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      await approveComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      alert("Error approving comment");
    }
  };

  const handleDisapproveComment = async (commentId) => {
    try {
      await disapproveComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      alert("Error disapproving comment");
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
          Manage products, categories, deliveries, and moderate comments
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
            onClick={() => setActiveTab("deliveries")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "deliveries"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Deliveries
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "comments"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Comments
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
                  salePrice: "",
                  costPrice: "",
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

          {isLoadingProducts ? (
            <p className="text-center text-gray-500 py-8">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Sale: ${product.salePrice}</p>
                      <p className="text-sm text-gray-600">Cost: ${product.costPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          product.status === "active"
                            ? "bg-success-light text-success"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
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
                setCategoryForm({ name: "", slug: "" });
                setShowCategoryModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Category
            </button>
          </div>

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
                  <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.productCount} products
                  </p>
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

      {/* Deliveries Tab */}
      {activeTab === "deliveries" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Tracking</h3>

          {isLoadingDeliveries ? (
            <p className="text-center text-gray-500 py-8">Loading deliveries...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-sand to-sage text-white">
                    <th className="px-4 py-3 text-left rounded-tl-2xl">
                      Delivery ID
                    </th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Tracking</th>
                    <th className="px-4 py-3 text-left">ETA</th>
                    <th className="px-4 py-3 text-left rounded-tr-2xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery, index) => (
                    <tr
                      key={delivery.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === deliveries.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {delivery.id}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {delivery.customer}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {delivery.product}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {delivery.address}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm font-mono">
                        {delivery.trackingNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {delivery.estimatedDelivery}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={delivery.status}
                          onChange={(e) =>
                            handleUpdateDeliveryStatus(delivery.id, e.target.value)
                          }
                          className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors font-semibold text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in-transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Comment Moderation
          </h3>

          {isLoadingComments ? (
            <p className="text-center text-gray-500 py-8">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No pending comments to moderate
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sand/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{comment.userName}</h4>
                      <p className="text-sm text-gray-500">
                        {comment.productName} • {comment.date}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < comment.rating ? "text-warning" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{comment.comment}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveComment(comment.id)}
                      className="flex-1 px-4 py-2 rounded-xl bg-success-light text-success font-semibold hover:bg-success hover:text-white transition-all duration-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDisapproveComment(comment.id)}
                      className="flex-1 px-4 py-2 rounded-xl bg-error/20 text-error font-semibold hover:bg-error hover:text-white transition-all duration-300"
                    >
                      Disapprove
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
                    Sale Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.salePrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, salePrice: e.target.value })
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
                    value={productForm.costPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, costPrice: e.target.value })
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
                  Slug
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                  required
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
