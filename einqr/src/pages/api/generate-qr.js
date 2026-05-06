import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import pool from '../../lib/db';

export const GET = async ({ cookies }) => {
  const session = cookies.get('session');
  
  if (!session) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  // Obtener el employee_id real del usuario desde la sesión
  let employeeId = 'unknown';
  try {
    const userId = session.value.replace('user-', '');
    const [rows] = await pool.execute('SELECT employee_id FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      employeeId = rows[0].employee_id;
    }
  } catch (e) {
    console.error("Error obteniendo employee_id para QR:", e);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const secretKey = "EINSUR2026";
  const qrValue = `${employeeId}|${timestamp}|${secretKey}`;

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
