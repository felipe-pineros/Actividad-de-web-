import { Router } from "express";
import type { CartItem } from "../types/index.d.js";
import { products } from "./products.js";
import fs from "fs/promises";
import path from "path";

const router = Router();

// 📁 Ruta del archivo de persistencia
const DATA_PATH = path.join(process.cwd(), "src", "data", "cart.json");

// 🧩 Funciones auxiliares
async function loadCart(): Promise<CartItem[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCart(cart: CartItem[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(cart, null, 2));
}

// 🛒 Obtener el carrito
router.get("/", async (_req, res) => {
  const cart = await loadCart();
  res.json(cart);
});

// ➕ Agregar producto
router.post("/add", async (req, res) => {
  const { productId, qty } = req.body as CartItem;

  // ✅ Validaciones
  if (!productId || typeof qty !== "number" || qty <= 0) {
    return res.status(400).json({
      error: "Datos inválidos: 'productId' es obligatorio y 'qty' debe ser mayor que 0.",
    });
  }

  // ✅ Verificar que el producto exista
  const productExists = products.some((p) => p.id === productId);
  if (!productExists) {
    return res.status(400).json({
      error: `El producto con ID '${productId}' no existe.`,
    });
  }

  const cart = await loadCart();
  const idx = cart.findIndex((i) => i.productId === productId);

  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ productId, qty });

  await saveCart(cart);
  res.json({ ok: true, cart });
});

// ➖ Eliminar producto
router.post("/remove", async (req, res) => {
  const { productId } = req.body as { productId: number };

  // ✅ Validar que venga el ID
  if (!productId) {
    return res.status(400).json({
      error: "Debe proporcionar el 'productId' para eliminar un producto del carrito.",
    });
  }

  // ✅ Validar que el producto exista
  const productExists = products.some((p) => p.id === productId);
  if (!productExists) {
    return res.status(400).json({
      error: `No se puede eliminar: el producto con ID '${productId}' no existe.`,
    });
  }

  let cart = await loadCart();
  const beforeCount = cart.length;
  cart = cart.filter((i) => i.productId !== productId);

  // Si el producto no estaba en el carrito
  if (cart.length === beforeCount) {
    return res.status(400).json({
      error: `El producto con ID '${productId}' no estaba en el carrito.`,
    });
  }

  await saveCart(cart);
  res.json({ ok: true, cart });
});

// 🔄 Vaciar carrito
router.post("/clear", async (_req, res) => {
  const cart: CartItem[] = [];
  await saveCart(cart);
  res.json({ ok: true, cart });
});

// 💰 Calcular total
router.get("/total", async (_req, res) => {
  const cart = await loadCart();
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product ? product.price : 0;
    return sum + item.qty * price;
  }, 0);
  res.json({ total });
});

export default router;
