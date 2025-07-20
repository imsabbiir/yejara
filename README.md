<div className="px-20 py-20 bg-red-700 absolute w-lvw right-0 ">
            <div className="grid grid-cols-4 gap-4 p-20">
              <div className="w-full">
                <Image
                  src="https://i.ibb.co/WWQrZJj4/electronics-banner-1.jpg"
                  alt="Headphone Banner"
                  width={500}
                  height={500}
                />
              </div>
              <Image
                src="https://i.ibb.co/jn6rSYX/mens-banner.jpg"
                alt="Men's Fashion"
                width={500}
                height={500}
              />
              <Image
                src="https://i.ibb.co/bRdmbtwt/womens-banner.jpg"
                alt="Women's Fashion"
                width={500}
                height={500}
              />
              <Image
                src="https://i.ibb.co/jZ3xMMVn/electronics-banner-2.jpg"
                alt="Mouse Collection"
                width={500}
                height={500}
              />
            </div>
          </div>







          import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Users from "@/models/users";

const JWT_SECRET = process.env.JWT_SECRET
export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "invalid Email" }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.hashPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid Passwrod" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ message: "login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "fetching data error" },
      { status: 500 }
    );
  }
}
