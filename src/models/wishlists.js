import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Wishlists || mongoose.model("Wishlists", wishlistItemSchema);
