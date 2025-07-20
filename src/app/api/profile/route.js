import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // ✅ Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT Token:", token);
    console.log("User:", { id: decoded.id, email: decoded.email });

    return NextResponse.json({
      token,
      user: { id: decoded.id, email: decoded.email },
    });

  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
