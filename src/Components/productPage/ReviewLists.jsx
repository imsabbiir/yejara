"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

function ReviewLists({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUser() {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.log("failed to fetch user data");
      }
    }

    fetchReviews();
    fetchUser();
  }, [productId]);

  // ✅ Start Editing
  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.review);
    setEditRating(review.rating);
  };

  // ✅ Cancel Editing
  const handleCancel = () => {
    setEditingReviewId(null);
    setEditText("");
    setEditRating(0);
  };

  // ✅ Save Edited Review
  const handleSave = async (review) => {
    try {
      const res = await fetch(`/api/reviews`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review._id,
          userId: user._id,
          rating: editRating,
          review: editText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? data.review : r))
        );
        setEditingReviewId(null); // exit edit mode
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  // ✅ Delete Review
  const handleDelete = async (reviewId) => {
    if (!user) return;
    const confirmDelete = confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}&userId=${user._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <p className="text-gray-500 mt-5">Loading reviews...</p>;
  if (error) return <p className="text-red-500 mt-5">{error}</p>;
  if (!reviews.length) return <p className="text-gray-500 mt-5">No reviews yet.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold text-[#333] mb-6">Review Lists</h2>
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {/* User Photo */}
            {review.photo ? (
              <Image
                src={review.photo}
                alt={review.name || "User"}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {review.name ? review.name[0].toUpperCase() : "U"}
              </div>
            )}

            {/* Review Content */}
            <div className="flex-1">
              <div className="leading-4">
                <h3 className="font-semibold text-gray-800">
                  {review.name || "User Name"}
                </h3>

                {editingReviewId === review._id ? (
                  // Editable Textarea
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-md text-gray-800"
                  />
                ) : (
                  // Static Text
                  <p className="text-gray-700 mt-1">{review.review}</p>
                )}
              </div>

              <div className="flex items-center gap-10 mt-3">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      size={16}
                      onClick={() =>
                        editingReviewId === review._id && setEditRating(index + 1)
                      }
                      className={`cursor-pointer ${
                        index < (editingReviewId === review._id ? editRating : review.rating)
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                {user && review.userId === user._id && (
                  <div className="flex gap-5">
                    {editingReviewId === review._id ? (
                      <>
                        <button
                          onClick={() => handleSave(review)}
                          className="cursor-pointer text-sm text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cursor-pointer text-sm text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(review)}
                          className="cursor-pointer text-sm text-[#444] hover:text-[#111]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="cursor-pointer text-sm text-[#444] hover:text-[#111]"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewLists;
