// assets/js/header-banner.js
(function () {
  function renderHeader() {
    var root = document.getElementById('header-root');
    if (!root) return;

    root.innerHTML = `
      <!-- Banner celeste con texto en movimiento -->
      <div class="top-banner">
        <div class="top-banner-track">
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
          <span>+ 1000 ARGENTINOS YA NOS ELIGIERON </span>
        </div>
      </div>

      <!-- HEADER -->
      <header class="site-header">
        <div class="container header-inner">

          <!-- HAMBURGUESA IZQUIERDA -->
          <button class="nav-toggle" type="button" aria-label="Abrir menú">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <!-- LOGO CENTRADO -->
          <div class="logo">
            <a href="index.html">
              <img
                src="assets/img/banners/logo encabezado.webp"
                alt="Exiluz"
                class="logo-img"
              />
            </a>
          </div>

          <!-- CARRITO DERECHA -->
          <a href="carrito.html" class="cart-link" aria-label="Ver carrito">
            <span class="cart-icon">🛒</span>
            <span id="cart-count" class="cart-count">0</span>
          </a>

        </div>
      </header>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
  } else {
    renderHeader();
  }
})();
