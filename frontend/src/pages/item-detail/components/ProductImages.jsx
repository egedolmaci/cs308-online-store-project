import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../store/slices/wishlistSlice";
import { addToast } from "../../../store/slices/toastSlice";

const ProductImages = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      dispatch(addToast({
        type: "warning",
        title: "Login Required",
        message: "Please log in to add items to your wishlist",
        duration: 3000
      }));
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      dispatch(addToast({
        type: "info",
        title: "Removed from Wishlist",
        message: `${product.name} removed from your wishlist`,
        duration: 3000
      }));
    } else {
      dispatch(addToWishlist(product.id));
      dispatch(addToast({
        type: "success",
        title: "Added to Wishlist",
        message: `${product.name} added to your wishlist`,
        duration: 3000
      }));
    }
  };

  // In a real app, products would have multiple images
  // For now, we'll use the same image as placeholder
  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
        <div className="aspect-square overflow-hidden bg-linear-to-br from-cream to-linen">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Stock Status Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="inline-block bg-error text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg">
                Out of Stock
              </span>
            </div>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <svg
            className="w-5 h-5 text-warning"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-base font-bold text-gray-900">
            {product.rating}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className={`absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 group/wishlist ${
            isWishlisted ? "ring-2 ring-error/30" : "hover:bg-white"
          }`}
        >
          <svg
            className={`w-6 h-6 transition-colors duration-300 ${
              isWishlisted
                ? "text-error"
                : "text-gray-400 group-hover/wishlist:text-error"
            }`}
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 hover:shadow-lg ${
              selectedImage === image
                ? "border-sage shadow-lg scale-105"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
