import { UserRole } from "@prisma/client";
import express from "express";
import {
  createProduct,
  decrease,
  deleteProduct,
  getProductById,
  getProducts,
  increase,
  stock,
  updateProduct,
} from "../controllers/productController";
import authenticate from "../middleware/authenticate"; // Middleware de autenticação
import authorize from "../middleware/authorize"; // Middleware de autorização

const router = express.Router();

// Middleware de autenticação aplicado globalmente
router.use(authenticate);

// Rotas para produtos com autorização baseada em role
router.post("/", authorize([UserRole.ADMIN]), createProduct);
router.get("/", getProducts); // Acesso público
router.get("/:id", getProductById); // Acesso público
router.put("/:id", authorize([UserRole.ADMIN]), updateProduct);
router.delete("/:id", authorize([UserRole.ADMIN]), deleteProduct);

//
router.post("/:id/decrease", authorize([UserRole.ADMIN]), decrease);
router.post("/:id/increase", authorize([UserRole.ADMIN]), increase);
router.get("/:id/stock", authorize([UserRole.ADMIN]), stock);

export default router;
