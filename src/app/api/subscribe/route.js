import { NextResponse } from "next/server";
import Subscriber from "@/models/Subscriber";
import dbConnect from "@/lib/mongoose";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check existing subscriber
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Save subscriber
    const subscriber = await Subscriber.create({
      email,
    });

    return NextResponse.json(
      {
        message: "Subscribed successfully",
        subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}