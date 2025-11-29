document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("header-root");
  if (!container) return;

  try {
    const response = await fetch("assets/partials/header.html");
    const html = await response.text();
    container.innerHTML = html;
  } catch (e) {
    console.error("No se pudo cargar header.html", e);
  }
});
