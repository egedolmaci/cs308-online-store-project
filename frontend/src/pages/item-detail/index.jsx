import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductSpecs from "./components/ProductSpecs";
import RelatedProducts from "./components/RelatedProducts";
import ProdcutMetaInfo from "./components/ProductMetaInfo";
import { useSelector } from "react-redux";
import LoadingScreen from "../../ui/components/LoadingScreen";

function ItemDetail() {
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Wait for products to load before attempting to find product
    if (loading) return;

    // If products are loaded but empty, redirect
    if (!loading && products.length === 0) {
      navigate("/404");
      return;
    }

    // Find the product by ID
    const foundProduct = products.find((p) => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);

      // Get related products from same category
      const related = products
        .filter(
          (p) =>
            p.category === foundProduct.category && p.id !== foundProduct.id
        )
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      // Redirect to 404 if product not found
      navigate("/404");
    }
  }, [id, products, loading, navigate]);

  if (!product) {
    return (
      <LoadingScreen message="Fetching products..."></LoadingScreen>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => navigate("/store")}
            className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
          >
            Store
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <ProductImages product={product} />

          {/* Product Info & Add to Cart */}
          <ProductInfo product={product} />
        </div>

        {/* Product Meta Info */}
        <ProdcutMetaInfo product={product} />

        {/* Product Specifications */}
        <ProductSpecs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
    </div>
  );
}

export default ItemDetail;
