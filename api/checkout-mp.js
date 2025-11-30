// api/checkout-mp.js
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN, // configurá esto en Vercel
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, cp, newsletter, shipping_mode, items } = req.body || {};

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Datos incompletos para generar el pago' });
      return;
    }

    // TODO (más adelante): acá podés guardar el pedido en Supabase

    const preference = {
      items: items.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        unit_price: it.unit_price,
        currency_id: it.currency_id || 'ARS',
      })),
      payer: {
        email,
      },
      metadata: {
        cp,
        newsletter,
        shipping_mode,
        source: 'exiluz_web',
      },
      back_urls: {
        success: 'https://tu-dominio-o-vercel/gracias.html',
        failure: 'https://tu-dominio-o-vercel/error-pago.html',
        pending: 'https://tu-dominio-o-vercel/pago-pendiente.html',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    const initPoint = response?.body?.init_point;
    if (!initPoint) {
      throw new Error('Mercado Pago no devolvió init_point');
    }

    res.status(200).json({ init_point: initPoint });

  } catch (err) {
    console.error('Error en /api/checkout-mp:', err);
    res.status(500).json({ error: 'Error interno al crear la preferencia' });
  }
}
