import { Router } from "express";
import type { CartItem } from "../types/index.d.js";
import { products } from "./products.js"; // 👈 Importa el catálogo de productos

const router = Router();

// 🛒 Obtener el carrito actual (guardado en la sesión)
router.get("/", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  res.json(cart);
});

// ➕ Agregar producto al carrito
router.post("/add", (req, res) => {
  const { productId, qty } = req.body as CartItem;

  if (!productId || qty == null || qty <= 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const sess: any = req.session;
  sess.cart = sess.cart || [];

  const idx = sess.cart.findIndex((i: CartItem) => i.productId === productId);
  if (idx >= 0) {
    sess.cart[idx].qty += qty;
  } else {
    sess.cart.push({ productId, qty });
  }

  res.json({ ok: true, cart: sess.cart });
});

// ➖ Eliminar un producto del carrito
router.post("/remove", (req, res) => {
  const { productId } = req.body as { productId: number };

  if (!productId) {
    return res.status(400).json({ error: "productId requerido" });
  }

  const sess: any = req.session;
  sess.cart = (sess.cart || []).filter((i: CartItem) => i.productId !== productId);

  res.json({ ok: true, cart: sess.cart });
});

// 🔄 Vaciar completamente el carrito
router.post("/clear", (req, res) => {
  (req.session as any).cart = [];
  res.json({ ok: true, cart: [] });
});

// 💰 Calcular el total del carrito
router.get("/total", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];

  // Calcula el total cruzando los IDs del carrito con el catálogo
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product ? product.price : 0;
    return sum + item.qty * price;
  }, 0);

  res.json({ total });
});

export default router;
