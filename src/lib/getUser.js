import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";

export async function getCurrentUser() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await Users.findById(decoded.id)
      .select("-hashPassword")
      .lean();
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
}