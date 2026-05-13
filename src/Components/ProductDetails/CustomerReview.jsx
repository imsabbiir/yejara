"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaStar, FaUser } from "react-icons/fa";

function CustomerReview({ productId }) {
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
    photo: "",
    name: "",
  });
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setFormData((prev) => ({
          ...prev,
          name: data.user.name || "",
          photo: data.user.photo || "",
        }));
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  const handleRating = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user._id) {
      alert("Please login first");
      return;
    }
    if (!formData.rating) {
      alert("Please provide a rating!");
      return;
    }
    if (!formData.review.trim()) {
      alert("Please write a review!");
      return;
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        userId: user._id,
        rating: formData.rating,
        review: formData.review,
        name: formData.name,
        photo: formData.photo,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      alert("Review submitted successfully!");
      setFormData({ ...formData, rating: 0, review: "" });
    } else {
      alert(data.message || "Failed to submit review");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <>
          {user?.photo ? (
            <Image
              src={user.photo}
              alt={user.name || "User Name"}
              width={500}
              height={500}
              className="w-12 h-12 object-cover rounded-full"
            />
          ) : (
            <div className="w-12 h-12 border border-gray-500 flex items-end justify-center bg-gray-200 rounded-full overflow-hidden">
              <FaUser className="text-gray-500 w-9 h-9" />
            </div>
          )}
        </>
        <div>
          <h2 className="font-semibold">{user?.name || "User Name"}</h2>
          <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={16}
                    className={`cursor-pointer ${
                      starValue <= (hover || formData.rating)
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder={user ? "Write your review..." : "Login to write a review"}
        name="review"
        value={formData.review}
        onChange={handleChange}
        className="mt-3 border border-red-300 rounded px-3 py-1 w-full"
        disabled={!user}
      />

      <p className="mt-2 text-sm text-gray-500">
        Your rating: {formData.rating} star
        {formData.rating > 1 ? "s" : ""}
      </p>

      <button
        onClick={handleSubmit}
        className={`px-5 py-2 rounded mt-5 text-white ${
          !user || !formData.rating || !formData.review.trim()
            ? "bg-red-300 cursor-not-allowed"
            : "bg-red-400 hover:bg-red-500 cursor-pointer"
        }`}
        disabled={!user}
      >
        Submit
      </button>
    </div>
  );
}

export default CustomerReview;
