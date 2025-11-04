import { Router } from "express";
const router = Router();
// In-memory catalog
const products = [
    {
        id: 1,
        name: "Runner Azul",
        price: 219999,
        image: "/img/shoe_1.png",
        description: "Zapatilla ligera para correr, malla transpirable.",
        stock: 12,
    },
    {
        id: 2,
        name: "Classic Rojo",
        price: 139999,
        image: "/img/shoe_2.png",
        description: "Clásico urbano para uso diario.",
        stock: 24,
    },
    {
        id: 3,
        name: "Aero Blanco",
        price: 199999,
        image: "/img/shoe_3.png",
        description: "Zapatilla ultraligera con tejido respirable y amortiguación reactiva.",
        stock: 8,
    },
    {
        id: 4,
        name: "Vintage Marrón",
        price: 169999,
        image: "/img/shoe_4.png",
        description: "Estilo retro con acabado en cuero sintético y suela antideslizante.",
        stock: 16,
    },
    {
        id: 5,
        name: "City Azul Marino",
        price: 189999,
        image: "/img/shoe_5.png",
        description: "Diseño urbano con soporte lateral reforzado y plantilla ergonómica.",
        stock: 10,
    },
    {
        id: 6,
        name: "Trail Rojo",
        price: 209999,
        image: "/img/shoe_6.png",
        description: "Calzado todoterreno, resistente al agua y con agarre para senderos.",
        stock: 7,
    },
];
router.get("/", (_req, res) => {
    res.json(products);
});
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);
    if (!product)
        return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
});
export default router;
