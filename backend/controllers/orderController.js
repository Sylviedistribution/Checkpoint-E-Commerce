import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { calculateOrderTotal } from "../utils/pricing.js";

const verifyStockAndBuildItems = async (requestedItems) => {
  const items = [];
  for (const requested of requestedItems) {
    const product = await Product.findById(requested.productId);
    if (!product) {
      throw Object.assign(new Error(`Produit introuvable : ${requested.productId}`), { statusCode: 400 });
    }
    if (product.stock < requested.quantity) {
      throw Object.assign(new Error(`Stock insuffisant pour « ${product.name} »`), { statusCode: 400 });
    }
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: requested.quantity,
      imageUrl: product.imageUrl,
    });
  }
  return items;
};

const decrementStock = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
    )
  );
};

export const createOrder = async (req, res, next) => {
  try {
    const { items: requestedItems, shippingAddress, paymentMethod } = req.body;
    if (!requestedItems?.length) {
      return res.status(400).json({ message: "Le panier est vide" });
    }
    const items = await verifyStockAndBuildItems(requestedItems);
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice: calculateOrderTotal(items),
    });
    await decrementStock(items);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès non autorisé à cette commande" });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

export const markOrderAsPaid = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "paid", paidAt: new Date() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
};
