### Zapatería Aether (MyShoeMe)
Proyecto de tienda virtual desarrollada con **Express**, **TypeScript** y **Bootstrap**, que incluye integración entre frontend y backend, manejo de sesiones mediante cookies y pruebas automatizadas con **Jest** y **Supertest**.

---

### Integrantes y Roles  
- Felipe Piñeros — Backend y estructura del servidor  
- Juan Pablo Marquez — Pruebas automatizadas y documentación  
- Juan Pablo Marquez — Frontend y diseño visual  


---

### Dependencias principales  
| Dependencia | Descripción |
|--------------|-------------|
| **express** | Framework backend para crear el servidor y manejar rutas HTTP. |
| **cors** | Permite la comunicación entre frontend y backend desde distintos orígenes. |
| **cookie-session** | Gestiona las sesiones mediante cookies, manteniendo activo el carrito. |
| **typescript** | Lenguaje tipado que mejora la estructura y el mantenimiento del proyecto. |
| **ts-node** | Ejecuta TypeScript sin necesidad de compilar manualmente durante desarrollo. |
| **jest** | Framework de testing para realizar pruebas automatizadas. |
| **supertest** | Biblioteca para simular peticiones HTTP al servidor en las pruebas. |

---

### Descripción general de las rutas del backend  
Las rutas se encuentran en `src/routes/` y se transpilan a `dist/routes/` al compilar el proyecto.

## `/products`
- **GET /api/products** → Devuelve el catálogo completo de productos (almacenado en memoria).  
- **GET /api/products/:id** → Devuelve un producto por su ID.

## `/cart`
- **GET /api/cart** → Obtiene los productos del carrito actual.  
- **POST /api/cart/add** → Agrega un nuevo producto al carrito.  
- **POST /api/cart/remove** → Elimina un producto específico del carrito.  
- **POST /api/cart/clear** → Vacía completamente el carrito.  
- **GET /api/cart/total** → Calcula el valor total actual del carrito.  

---

### Funcionamiento del carrito e integración Front–Back  
## 🔹 Catálogo (`public/index.html`)
- Permite filtrar productos por nombre o rango de precios.  
- Carga los productos desde el backend mediante `fetch('/api/products')`.  
- Al presionar **“Agregar al carrito”**, se envía una petición `POST` al backend (`/api/cart/add`).  
- Se actualiza dinámicamente el contador 🛒 del carrito con JavaScript.  

## 🔹 Carrito (`public/cart.html`)
- Muestra los productos seleccionados, sus cantidades, subtotales y total.  
- Permite **eliminar productos**, **vaciar el carrito** o **proceder al pago**.  
- Incluye un **toast de confirmación** (Bootstrap) al agregar productos.  
- El carrito se mantiene activo mientras la sesión está vigente (manejo con `cookie-session`).  

---

### Prueba funcional (Punto 10.1)  
> Esta es la primera de las 10 pruebas de software requeridas.  
> Las siguientes pruebas serán desarrolladas por los demás integrantes del equipo.  

## Objetivo  
Verificar el correcto funcionamiento del carrito de compras y la comunicación entre frontend y backend.  

## Pasos manuales  

Clona el repositorio del proyecto:  
git clone https://github.com/felipe-pineros/Actividad-de-web-
cd Actividad-de-web-

## Instala las dependencias:
- npm install

## Ejecuta el proyecto en modo desarrollo:
- npm run dev

## Ingresa a http://localhost:3000

## Agrega varios productos al carrito desde la página principal (index.html).

## Confirma que aparece el mensaje ✅ “Producto agregado al carrito”.

## Ingresa a cart.html y verifica que los productos se muestran correctamente con su cantidad y subtotal.

## Usa el botón “Eliminar” → el producto debe desaparecer de la tabla.

## Usa “Vaciar Carrito” → el carrito queda vacío.

## Recarga la página → el carrito debe permanecer vacío (sesión reiniciada).

## ✅ Resultado esperado
- El contador del carrito se actualiza correctamente.

## Las operaciones de agregar, eliminar y vaciar funcionan sin errores.
## No hay fallos de conexión entre frontend y backend.

---

### Elementos de seguridad y autenticación (5 implementaciones)
- CORS configurado para permitir solo orígenes definidos.
- cookie-session con claves de cifrado seguras.
- Validación de datos en las rutas /api/cart y /api/products para evitar inyecciones o valores inválidos.
- Uso de HTTPS (en despliegue) para proteger los datos del usuario.
- Expiración de sesión configurada en 24 horas o al cerrar el navegador.

---

### Estructura del proyecto

Actividad-de-web/
├─ dist/
│  ├─ routes/
│  │  ├─ cart.js
│  │  ├─ products.js
│  ├─ server.js
│
├─ node_modules/
│
├─ public/
│  ├─ css/
│  │  └─ styles.css
│  ├─ img/
│  │  ├─ shoe_1.png ... shoe_9.png
│  ├─ js/
│  │  ├─ app.js
│  │  └─ cart.js
│  ├─ cart.html
│  └─ index.html
│
├─ src/
│  ├─ data/
│  ├─ routes/
│  │  ├─ cart.ts
│  │  ├─ products.ts
│  ├─ types/
│  └─ server.ts
│
├─ tests/
│  ├─ server.test.js
│  ├─ plantilla_pruebas.jsnp
│
├─ jest.config.js
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ README.md

### Pruebas automatizadas
- El proyecto incluye pruebas automáticas para validar el funcionamiento del backend utilizando Jest y Supertest.

## Herramientas utilizadas
- Jest → Framework de testing.
- Supertest → Cliente HTTP para simular peticiones a las rutas del servidor Express.
- Node.js (modo ESM) → Permite el uso de import/export en las pruebas.

## Archivos de prueba
tests/server.test.js → Pruebas principales implementadas.
tests/plantilla_pruebas.js → Base para que otros integrantes agreguen nuevas pruebas.

## Cómo ejecutar las pruebas
npm test

## Cómo crear nuevas pruebas
- En la carpeta tests/, crea un nuevo archivo:
tests/nuevaPrueba.test.js
- Importa el servidor y Supertest:
import request from 'supertest';
import app from '../dist/server.js';

## Crea una nueva suite de pruebas:
describe('🧩 Prueba personalizada', () => {
  test('Debe responder con estado 200 en /api/products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });
});

## Ejecuta con npm test y verifica que todas pasen.

---

### Ejecución general del proyecto
- Desarrollo
npm run dev
Visita: http://localhost:3000
- Producción
npm run build
npm start

### Notas finales
- Proyecto compilado con TypeScript → salida en dist/.
- Usa "type": "module" para compatibilidad con ES Modules.
- Catálogo e imágenes generadas localmente como placeholders.
- Pruebas implementadas bajo entorno Node con Jest + Supertest.

### Estado del Proyecto
Versión 1.0.0 — Aplicación funcional con integración entre frontend y backend, manejo de sesiones y pruebas automatizadas correctamente configuradas.