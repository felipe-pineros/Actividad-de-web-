import { Router } from "express";
import { products } from "./products.js";
import fs from "fs/promises";
import path from "path";
const router = Router();
// 📁 Ruta del archivo de persistencia
const DATA_PATH = path.join(process.cwd(), "src", "data", "cart.json");
// 🧩 Funciones auxiliares
async function loadCart() {
    try {
        const data = await fs.readFile(DATA_PATH, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return [];
    }
}
async function saveCart(cart) {
    await fs.writeFile(DATA_PATH, JSON.stringify(cart, null, 2));
}
// 🛒 Obtener el carrito
router.get("/", async (_req, res) => {
    const cart = await loadCart();
    res.json(cart);
});
// ➕ Agregar producto
router.post("/add", async (req, res) => {
    const { productId, qty } = req.body;
    if (!productId || qty == null || qty <= 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }
    const cart = await loadCart();
    const idx = cart.findIndex((i) => i.productId === productId);
    if (idx >= 0)
        cart[idx].qty += qty;
    else
        cart.push({ productId, qty });
    await saveCart(cart);
    res.json({ ok: true, cart });
});
// ➖ Eliminar producto
router.post("/remove", async (req, res) => {
    const { productId } = req.body;
    if (!productId)
        return res.status(400).json({ error: "productId requerido" });
    let cart = await loadCart();
    cart = cart.filter((i) => i.productId !== productId);
    await saveCart(cart);
    res.json({ ok: true, cart });
});
// 🔄 Vaciar carrito
router.post("/clear", async (_req, res) => {
    const cart = [];
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
