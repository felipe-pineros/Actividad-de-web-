import request from 'supertest';
import app from '../dist/server.js';

/**
 * 🧪 Pruebas adicionales del carrito
 * Este archivo complementa las pruebas principales del backend.
 * Ejecuta peticiones reales al servidor y valida las respuestas.
 */

describe('🧪 Pruebas adicionales del carrito', () => {

  // 🧩 PRUEBA 1: Eliminar producto del carrito
  test('PRUEBA 1: Debe eliminar un producto del carrito correctamente', async () => {
    // Primero agregamos un producto
    await request(app)
      .post('/api/cart/add')
      .send({ productId: 1, qty: 2 });

    // Luego intentamos eliminarlo
    const res = await request(app)
      .post('/api/cart/remove')
      .send({ productId: 1 });

    // Validaciones
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(Array.isArray(res.body.cart)).toBe(true);
  });

});
