const CART_KEY = "exiluz_cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  const cart = readCart();
  return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  el.textContent = getCartCount();
}

function formatCurrency(n) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0
  });
}

function renderCart() {
  const cart = readCart();
  const items = Object.values(cart);
  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");
  const listEl = document.getElementById("cart-items-container");

  const subtotalEl = document.getElementById("summary-subtotal");
  const discountEl = document.getElementById("summary-discount");
  const totalEl = document.getElementById("summary-total");

  if (!items.length) {
    if (emptyEl) emptyEl.style.display = "block";
    if (contentEl) contentEl.style.display = "none";
    updateCartCount();
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  if (contentEl) contentEl.style.display = "grid";

  listEl.innerHTML = "";

  let subtotal = 0;
  let totalQty = 0;

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const price = item.price;
    const rowSubtotal = price * item.quantity;
    subtotal += rowSubtotal;
    totalQty += item.quantity;

    // 🔥 Fallback de imagen corregido: usa tu foto real p1.webp
    const imageSrc = item.image || "assets/img/banners/p1.webp";

    row.innerHTML = `
      <div class="cart-item-main">
        <div class="cart-item-img">
          <img src="${imageSrc}" alt="${item.name}" />
        </div>
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Envío gratis</div>
          <div class="cart-item-meta">Hasta 20% OFF comprando en cantidad</div>
          <div class="cart-item-remove" data-id="${item.id}">Quitar</div>
        </div>
      </div>
      <div class="cart-qty" data-id="${item.id}">
        <button class="btn-dec">-</button>
        <span>${item.quantity}</span>
        <button class="btn-inc">+</button>
      </div>
      <div class="cart-price">${formatCurrency(price)}</div>
      <div class="cart-subtotal">${formatCurrency(rowSubtotal)}</div>
    `;

    listEl.appendChild(row);
  });

  // Descuento: 15% si hay 2 o más unidades
  let discount = 0;
  if (totalQty >= 2) {
    discount = Math.round(subtotal * 0.15);
  }

  const total = subtotal - discount;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (discountEl)
    discountEl.textContent = discount ? "-" + formatCurrency(discount) : "-$0";
  if (totalEl) totalEl.textContent = formatCurrency(total);

  updateCartCount();

  // Eventos de +, -, quitar (delegados)
  listEl.addEventListener(
    "click",
    (ev) => {
      const btn = ev.target;

      if (btn.classList.contains("btn-inc") || btn.classList.contains("btn-dec")) {
        const wrapper = btn.closest(".cart-qty");
        const id = wrapper.dataset.id;
        const cart = readCart();
        const item = cart[id];
        if (!item) return;

        if (btn.classList.contains("btn-inc")) {
          item.quantity += 1;
        } else {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            delete cart[id];
          }
        }

        writeCart(cart);
        renderCart();
        return;
      }

      if (btn.classList.contains("cart-item-remove")) {
        const id = btn.dataset.id;
        const cart = readCart();
        delete cart[id];
        writeCart(cart);
        renderCart();
      }
    },
    { once: true }
  );
}

async function handleCheckout() {
  const msgEl = document.getElementById("checkout-message");
  const cart = readCart();
  const items = Object.values(cart);

  if (!items.length) {
    if (msgEl) msgEl.textContent = "Tu carrito está vacío.";
    return;
  }

  try {
    if (msgEl) msgEl.textContent = "Creando tu orden, aguardá un momento...";

    const payload = {
      items: items.map((item) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS"
      }))
    };

    const res = await fetch("/api/mp/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Error al crear preferencia");
    }

    const data = await res.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      throw new Error("Respuesta inválida de Mercado Pago");
    }
  } catch (err) {
    console.error(err);
    if (msgEl)
      msgEl.textContent =
        "No pudimos iniciar el pago. Intentalo de nuevo en unos minutos.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout) btnCheckout.addEventListener("click", handleCheckout);

  renderCart();
});
