import pool from '../../lib/db';
import bcrypt from 'bcryptjs';

export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const employee_id = body.employee_id?.trim();
    const password = body.password?.trim();

    if (!employee_id || !password) {
      return new Response(JSON.stringify({ message: 'Código de empleado y contraseña requeridos' }), { status: 400 });
    }

    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE employee_id = ?', [employee_id]);
      
      console.log('Login attempt for:', `"${employee_id}"`);
      console.log('Rows found:', rows.length);

      let isValid = false;
      let user = null;

      if (rows.length > 0) {
        user = rows[0];
        isValid = await bcrypt.compare(password, user.password);
      }

      // Bypass especial para desarrollo
      if (employee_id === 'admin' && password === 'admin') {
        console.log('Admin bypass activated');
        isValid = true;
      }

      if (!isValid) {
        return new Response(JSON.stringify({ message: 'Credenciales inválidas' }), { status: 401 });
      }

      // Generar sesión
      const userId = user ? user.id : 'admin';
      cookies.set('session', `user-${userId}`, { 
        path: '/', 
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 día
      });

      return new Response(JSON.stringify({ message: 'Login exitoso' }), { status: 200 });

    } catch (dbError) {
      console.error('DB Error:', dbError);
      // Fallback para pruebas sin DB configurada
      if (employee_id === 'admin' && password === 'admin') {
        cookies.set('session', 'admin-session-token', { path: '/', httpOnly: true });
        return new Response(JSON.stringify({ message: 'Login exitoso (Fallback)' }), { status: 200 });
      }
      return new Response(JSON.stringify({ message: 'Error de base de datos' }), { status: 500 });
    }

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error interno' }), { status: 500 });
  }
};
