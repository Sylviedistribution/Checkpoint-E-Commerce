import Product from "../models/Product.js";

const buildProductFilters = ({ search, category, minPrice, maxPrice }) => {
  const filters = {};
  if (search) filters.$text = { $search: search };
  if (category) filters.category = category;
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }
  return filters;
};

export const listProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Number(req.query.pageSize) || 12);
    const filters = buildProductFilters(req.query);

    const [products, totalCount] = await Promise.all([
      Product.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filters),
    ]);

    res.json({ products, page, totalPages: Math.ceil(totalCount / pageSize), totalCount });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    product.reviews.push({
      user: req.user._id,
      authorName: req.user.name,
      rating,
      comment,
    });
    product.recalculateAverageRating();
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};
