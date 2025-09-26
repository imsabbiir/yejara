import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Hash password (using bcrypt)
    const bcrypt = require("bcryptjs");
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new Users({
      name,
      email,
      hashPassword,
      role: "customer",
      photo: "",
      address: ""
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
