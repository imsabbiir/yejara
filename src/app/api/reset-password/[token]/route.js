import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/users";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { password } = await req.json();

    const token = params.token;

    // hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIXED FIELD NAME
    user.hashPassword = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
