const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isAvailable: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
