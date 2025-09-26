import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Review from "@/models/reviews";

export async function GET(request) {
  try {
    await dbConnect();

     const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({productId});
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Review comment Fetching Error" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, userId, rating, review, name, photo } = body;
    if (!productId || !userId) {
      return NextResponse.json(
        { message: "ProductId or UserId are not valid" },
        { status: 400 }
      );
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    if (!review || review.trim().length < 5) {
      return NextResponse.json(
        { message: "Review must be at least 5 characters long" },
        { status: 400 }
      );
    }
    const newReview = new Review({
      productId,
      userId,
      rating,
      review,
      name,
      photo,
    });

    await newReview.save();

    return NextResponse.json(
      { message: "Review added successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Review comment Post Error" },
      { status: 500 }
    );
  }
}



export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { reviewId, userId, rating, review } = body;

    if (!reviewId || !userId) {
      return NextResponse.json(
        { message: "ReviewId and UserId are required" },
        { status: 400 }
      );
    }

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Make sure user is the owner of the review
    if (existingReview.userId.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to edit this review" },
        { status: 403 }
      );
    }

    // Update fields
    if (rating) existingReview.rating = rating;
    if (review) existingReview.review = review;

    await existingReview.save();

    return NextResponse.json(
      { message: "Review updated successfully", review: existingReview },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Review update error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE Review
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");
    const userId = searchParams.get("userId");

    if (!reviewId || !userId) {
      return NextResponse.json(
        { message: "ReviewId and UserId are required" },
        { status: 400 }
      );
    }

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Make sure user is the owner of the review
    if (existingReview.userId.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this review" },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Review delete error" },
      { status: 500 }
    );
  }
}