import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  required: true,
},

  title: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    address: {
      village: String,
      district: String,
      policeStation: String,
      postalCode: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "card", "cod"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
