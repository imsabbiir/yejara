import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, address, photo } = await req.json();

    const updatedUser = await Users.findByIdAndUpdate(
      decoded.id,
      { name, email, address, photo },
      { new: true }
    );

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update failed", error }, { status: 500 });
  }
}
