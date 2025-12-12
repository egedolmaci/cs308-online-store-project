import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingReviews,
  approveReview,
  disapproveReview,
  selectPendingReviews,
  selectReviewsLoading,
  selectReviewsError,
} from "../../../store/slices/reviewsSlice";

const ReviewsManagement = () => {
  const dispatch = useDispatch();
  const pendingReviews = useSelector(selectPendingReviews);
  const isLoadingReviews = useSelector(selectReviewsLoading);
  const reviewsError = useSelector(selectReviewsError);

  useEffect(() => {
    dispatch(getPendingReviews());
  }, [dispatch]);

  const handleApproveComment = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
    } catch (error) {
      alert(error || "Error approving review");
    }
  };

  const handleDisapproveComment = async (reviewId) => {
    try {
      await dispatch(disapproveReview(reviewId)).unwrap();
    } catch (error) {
      alert(error || "Error disapproving review");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Moderation
        </h2>
        <p className="text-gray-600">
          Approve or manage pending product reviews
        </p>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
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
                    <h4 className="font-bold text-gray-900">
                      {review.user_name || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Product ID: {review.product_id} •{" "}
                      {new Date(review.created_at).toLocaleDateString()}
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
                  <button
                    onClick={() => handleDisapproveComment(review.id)}
                    className="flex-1 px-4 py-2 rounded-xl bg-error/10 text-error font-semibold hover:bg-error hover:text-white transition-all duration-300"
                  >
                    Disapprove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManagement;
