import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  try {
    await dbConnect();

    // =========================
    // GET TOKEN
    // =========================
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // VERIFY TOKEN SAFELY
    // =========================
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // =========================
    // GET REQUEST BODY
    // =========================
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // =========================
    // FIND USER
    // =========================
    const user = await Users.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // =========================
    // CHECK PASSWORD (IMPORTANT FIELD: hashPassword)
    // =========================
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.hashPassword
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        { status: 400 }
      );
    }

    // =========================
    // HASH NEW PASSWORD
    // =========================
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.hashPassword = hashedPassword;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}