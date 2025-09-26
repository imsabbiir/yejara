import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !currentPassword || !newPassword) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashPassword);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
    }

    user.hashPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    return new Response(JSON.stringify({ message: "Password changed successfully" }), { status: 200 });
  } catch (error) {
    console.error("Password change error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
