const fmt = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

let ALL_PRODUCTS = [];
let FILTERS = { text: '', min: null, max: null };

function renderProducts(products) {
  const list = document.getElementById('product-list');
  if (!products.length) {
    list.innerHTML = `<div class="col-12"><div class="alert alert-warning">No hay productos que coincidan con el filtro.</div></div>`;
    return;
  }
  list.innerHTML = products.map(p => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="text-muted mb-2">${p.description}</p>
          <p class="fw-bold">${fmt(p.price)}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary" data-id="${p.id}" data-qty="1">Agregar</button>
            <div class="input-group" style="max-width:160px">
              <button class="btn btn-outline-secondary btn-sm" data-action="dec" data-id="${p.id}">-</button>
              <input type="number" class="form-control form-control-sm text-center" value="1" min="1" step="1" data-input="${p.id}">
              <button class="btn btn-outline-secondary btn-sm" data-action="inc" data-id="${p.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const input = list.querySelector(`input[data-input="${id}"]`);
      let v = Number(input.value) || 1;
      if (btn.dataset.action === 'inc') v++;
      if (btn.dataset.action === 'dec') v = Math.max(1, v - 1);
      input.value = String(v);
    });
  });

  list.querySelectorAll('button.btn-primary[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const input = list.querySelector(`input[data-input="${id}"]`);
      const qty = Math.max(1, Number(input?.value) || 1);
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, qty })
      });
      updateCartCount();
    });
  });
}

function applyFilters() {
  const text = (FILTERS.text || '').toLowerCase().trim();
  const min = typeof FILTERS.min === 'number' ? FILTERS.min : -Infinity;
  const max = typeof FILTERS.max === 'number' ? FILTERS.max : Infinity;
  const filtered = ALL_PRODUCTS.filter(p => {
    const byText = !text || p.name.toLowerCase().includes(text);
    const byPrice = p.price >= min && p.price <= max;
    return byText && byPrice;
  });
  renderProducts(filtered);
}

async function loadProducts() {
  const res = await fetch('/api/products');
  ALL_PRODUCTS = await res.json();
  applyFilters();
  updateCartCount();
}

function setupFilterUI() {
  const txt = document.getElementById('searchText');
  const min = document.getElementById('minPrice');
  const max = document.getElementById('maxPrice');
  if (txt) txt.addEventListener('input', () => { FILTERS.text = txt.value; applyFilters(); });
  if (min) min.addEventListener('input', () => { 
    const v = Number(min.value);
    FILTERS.min = Number.isFinite(v) && v >= 0 ? v : null;
    applyFilters();
  });
  if (max) max.addEventListener('input', () => { 
    const v = Number(max.value);
    FILTERS.max = Number.isFinite(v) && v >= 0 ? v : null;
    applyFilters();
  });
}

async function updateCartCount() {
  const res = await fetch('/api/cart');
  const cart = await res.json();
  const count = cart.reduce((acc, i) => acc + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = String(count);
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilterUI();
  loadProducts();
});
