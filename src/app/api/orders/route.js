import dbConnect from "@/lib/mongoose";
import Order from "@/models/order";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      userId,
      items,
      shipping,
      paymentMethod,
      totalAmount,
      payment,
    } = body;

    // VALIDATION
    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !shipping ||
      !paymentMethod ||
      !totalAmount
    ) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // CREATE ORDER
    const order = await Order.create({
      userId,
      items,
      shipping,
      paymentMethod,
      totalAmount,
      payment,

      orderStatus: "Placed",

      statusHistory: [
        {
          status: "Placed",
          date: new Date(),
        },
      ],
    });

    return Response.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);

    return Response.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}