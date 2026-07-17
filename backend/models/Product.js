import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Le nom du produit est requis"], trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [0, "Le prix doit être positif"] },
    category: { type: String, required: true, index: true },
    imageUrl: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

productSchema.methods.recalculateAverageRating = function recalculateAverageRating() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
};

export default mongoose.model("Product", productSchema);
