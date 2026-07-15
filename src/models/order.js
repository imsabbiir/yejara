import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    qty: Number,
    image: String,
    color: String,
    type: String,
  },
  { _id: false },
);

const ShippingSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    city: String,
    zip: String,
  },
  { _id: false },
);

const PaymentSchema = new mongoose.Schema(
  {
    id: String,
    amount: Number,
    status: String,
    client_secret: String,
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    items: [OrderItemSchema],

    shipping: ShippingSchema,

    paymentMethod: {
      type: String,
      enum: ["card", "cod"],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    payment: PaymentSchema,

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "processing",
        "shipped",
        "out for delivery",
        "delivered",
        "cancelled",
      ],
      default: "Placed",
    },

    statusHistory: [
      {
        status: String,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
