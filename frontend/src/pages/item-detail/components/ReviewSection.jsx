import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { reviewsAPI } from "../../../api";
import AddReviewForm from "./AddReviewForm";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsAPI.fetchReviewsByProduct(productId);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewAdded = () => {
    setShowAddReview(false);
    fetchReviews(); // Refresh reviews after adding
  };

  // Calculate average rating (only from reviews with ratings)
  const reviewsWithRating = reviews.filter((r) => r.rating !== null);
  const averageRating =
    reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) /
        reviewsWithRating.length
      : 0;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              {reviewsWithRating.length > 0 ? (
                <>
                  {renderStars(Math.round(averageRating))}
                  <span className="text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({reviewsWithRating.length}{" "}
                    {reviewsWithRating.length === 1 ? "rating" : "ratings"})
                  </span>
                </>
              ) : (
                <span className="text-gray-500">
                  ({reviews.length} reviews)
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 hover:shadow-lg active:scale-95 transition-all duration-300"
        >
          {showAddReview ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <AddReviewForm
          productId={productId}
          onReviewAdded={handleReviewAdded}
          onCancel={() => setShowAddReview(false)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-error/10 border-2 border-error text-error px-6 py-4 rounded-2xl text-center">
          {error}
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-6 mt-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-linen to-cream rounded-2xl p-6 border-2 border-sand/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-900">
                      {review.user_name || "Anonymous"}
                    </h4>
                    {review.rating !== null && renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              {review.comment && review.is_approved && (
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
              {review.comment &&
                !review.is_approved &&
                review.status != "disapproved" && (
                  <p className="mt-4 text-gray-500 italic">
                    This review is pending approval.
                  </p>
                )}
              {review.status === "disapproved" && (
                <p className="mt-4 text-gray-500 italic">
                  This review is not approved!
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
