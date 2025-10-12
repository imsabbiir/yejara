import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Users from "@/models/users";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ user: null }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).select("-hashPassword");

    return Response.json({ user });
  } catch (error) {
    return Response.json({ user: null }, { status: 401 });
  }
}
