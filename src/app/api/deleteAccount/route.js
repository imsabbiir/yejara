import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE() {
  try {
    await dbConnect();

    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    await Users.findByIdAndDelete(decoded.id);

    const response = NextResponse.json({ message: "Account deleted successfully" });
    response.cookies.set("token", "", { maxAge: 0 });

    return response;
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
