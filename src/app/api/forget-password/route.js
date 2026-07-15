import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import User from "@/models/users";
import { sendResetEmail } from "@/lib/sendMail";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // create token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // 🔥 SEND EMAIL TO REAL INBOX
    await sendResetEmail(user.email, resetUrl);

    return Response.json({
      message: "Reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
