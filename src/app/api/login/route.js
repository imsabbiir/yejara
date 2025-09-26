import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const isMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const response = NextResponse.json({
      message: "login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || null,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ message: "login faild" }, { status: 500 });
  }
}
