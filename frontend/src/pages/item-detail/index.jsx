import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockProducts } from "../store/data/mock";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductSpecs from "./components/ProductSpecs";
import RelatedProducts from "./components/RelatedProducts";
import ProdcutMetaInfo from "./components/ProductMetaInfo";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Find the product by ID
    const foundProduct = mockProducts.find((p) => p.id === parseInt(id));

    if (foundProduct) {
      setProduct(foundProduct);

      // Get related products from same category
      const related = mockProducts
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
  }, [id, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
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
