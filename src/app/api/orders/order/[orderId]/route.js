import dbConnect from "@/lib/mongoose";
import Orders from "@/models/order";
import { NextResponse } from "next/server";

const allowedStatus = [
  "Placed",
  "Processing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Delivery Complete",
  "Cancelled",
];



export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;

    let { orderStatus } = await req.json();

    orderStatus = orderStatus;

    if (!allowedStatus.includes(orderStatus)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      {
        $set: { orderStatus },

        $push: {
          statusHistory: {
            status: orderStatus,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Status updated",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { orderId } = params;

    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error deleting order:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
