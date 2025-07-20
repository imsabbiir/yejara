import mongoose from "mongoose";

// Subcategory schema
const SubcategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true, // ✅ make subcategory name unique across DB
    lowercase: true,
    trim: true,
  },
  pageLink: {
    type: String,
    required: true,
  }
});

// Main category schema
const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true, // ✅ make main category name unique
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  pageLink: {
    type: String,
    required: true,
  },
  subcategories: {
    type: [SubcategorySchema],
    default: [],
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
