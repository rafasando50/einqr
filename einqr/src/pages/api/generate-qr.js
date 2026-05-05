import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export const GET = async ({ cookies }) => {
  const session = cookies.get('session');
  
  if (!session) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  // En una app real, aquí generaríamos un token firmado (JWT) con una expiración corta
  // Por ahora usaremos un identificador con timestamp para demostrar el cambio
  const timestamp = Math.floor(Date.now() / 1000);
  const qrValue = `GAFETE|${session.value}|${timestamp}|${Math.random().toString(36).substring(7)}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return new Response(JSON.stringify({ 
      qr: qrDataUrl,
      expiresIn: 10, // Segundos para la próxima actualización
      timestamp: timestamp
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error generando QR' }), { status: 500 });
  }
};
