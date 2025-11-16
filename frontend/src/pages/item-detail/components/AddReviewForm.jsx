import { useState } from "react";
import { Star } from "lucide-react";
import { reviewsAPI } from "../../../api";

const AddReviewForm = ({ productId, onReviewAdded, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await reviewsAPI.createReview(productId, {
        rating,
        comment: comment.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        onReviewAdded();
      }, 1500);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarInput = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-600 font-semibold">
            {rating} / 5
          </span>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div className="bg-success/10 border-2 border-success rounded-2xl p-8 mb-8 text-center">
        <div className="text-success text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-success mb-2">
          Review Submitted Successfully!
        </h3>
        <p className="text-gray-600">
          Your review is pending approval and will be visible soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sage/20 to-linen rounded-2xl p-6 lg:p-8 mb-8 border-2 border-sand/30">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Write Your Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Rating *
          </label>
          {renderStarInput()}
        </div>

        {/* Comment Input */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={5}
            className="w-full px-4 py-3 border-2 border-sand/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 resize-none"
            disabled={submitting}
          />
          <p className="text-sm text-gray-500 mt-2">
            {comment.length} characters (minimum 10 required)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border-2 border-error text-error px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewForm;
