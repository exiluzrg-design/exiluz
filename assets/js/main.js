// Config básica del producto
const PRODUCT = {
  id: "llavero-elijo-creer",
  name: "Llavero Elijo Creer",
  price: 18000,
  image: "assets/img/llavero-elijo-creer.jpg"
};

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

function addProductToCart(qty = 1) {
  const cart = readCart();
  const current = cart[PRODUCT.id] || {
    id: PRODUCT.id,
    name: PRODUCT.name,
    price: PRODUCT.price,
    image: PRODUCT.image,
    quantity: 0
  };
  current.quantity += qty;
  cart[PRODUCT.id] = current;
  writeCart(cart);
  updateCartCount();
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

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  const btn1 = document.getElementById("btn-add-home");
  const btn2 = document.getElementById("btn-add-card");
  const yearEl = document.getElementById("year");

  if (btn1) btn1.addEventListener("click", () => addProductToCart(1));
  if (btn2) btn2.addEventListener("click", () => addProductToCart(1));
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateCartCount();
});
