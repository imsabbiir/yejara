import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/users";
export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // ✅ Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      token,
      user: { id: decoded.id, email: decoded.email },
    });

  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}


export async function PATCH(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      city,
      zip,
      photo
    } = body;

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zip = zip || user.zip;
    user.photo = photo || user.photo;


    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}