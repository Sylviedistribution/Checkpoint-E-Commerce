import { Router } from "express";
import {
  createOrder,
  listMyOrders,
  getOrderById,
  markOrderAsPaid,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.post("/", createOrder);
router.get("/mine", listMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/pay", markOrderAsPaid);

export default router;
