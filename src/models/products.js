import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offerStatus: {
      type: Boolean,
      default: false,
    },
    offerPrice: {
      type: String, // You can change this to Number if all prices will be numeric
      default: "",
    },
    offerTimeLeft: {
      type: String, // ISO date string (can be Date type too)
      default: "",
    },
  },
  { _id: false },
);

const variantOptionSchema = new mongoose.Schema(
  {
    type: {
      type: String, // e.g., size or unit type like '30', 'Standard', etc.
      required: true,
    },
    regularPrice: {
      type: String,
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    soldStock: {
      type: Number,
      default: 0,
    },
    offer: offerSchema,
  },
  { _id: false },
);

const variantsSchema = new mongoose.Schema(
  {
    colorVariants: [
      {
        name: String,
        hex: String,
      },
    ],
    options: [variantOptionSchema],
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    category: {
      type: String,
      required: true,
    },
    categorySlug: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    subCategorySlug: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    totalStock: {
      type: Number,
      required: true,
    },
    soldStock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    variants: variantsSchema,
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
