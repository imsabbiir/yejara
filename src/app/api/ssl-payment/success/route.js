import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/order";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("id");

    const formData = await req.formData();
    const status = formData.get("status");
    const amount = formData.get("amount");

    if (status !== "VALID") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart?status=failed`,
        { status: 303 },
      );
    }

    // Retrieve the stringified metadata fields passed down from step 1
    // const userId = formData.get("value_a");
    // const items = JSON.parse(formData.get("value_b"));
    // const shipping = JSON.parse(formData.get("value_c"));

    await dbConnect();

    // Create the document matching your database layout
    const order = await Order.create({
      // userId,
      // items,
      // shipping,
      paymentMethod: "sslcommerce",
      totalAmount: parseFloat(amount),
      payment: {
        status: "Paid",
        transactionId: tran_id,
        gateway: "SSLCommerz",
      },
      orderStatus: "Placed",
      statusHistory: [{ status: "Placed", date: new Date() }],
    });
    console.log("order form new order", order);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/cart?status=success&id=${tran_id}`,
      { status: 200 },
    );
  } catch (error) {
    console.error("SSL Success Route Error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/cart?status=error`,
      { status: 303 },
    );
  }
}
