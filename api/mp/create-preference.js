// /api/mp/create-preference.js
// Endpoint serverless para Vercel

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const body = req.body && typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const items = body?.items || [];

    if (!items.length) {
      res.status(400).json({ error: "Carrito vacío" });
      return;
    }

    const preference = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: "https://exiluz.com.ar/",
        failure: "https://exiluz.com.ar/carrito.html",
        pending: "https://exiluz.com.ar/carrito.html"
      },
      auto_return: "approved"
    });

    res.status(200).json({ init_point: preference.body.init_point });
  } catch (err) {
    console.error("MP error", err);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
};
