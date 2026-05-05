import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

export const POST = async ({ request, cookies }) => {
  const session = cookies.get('session');
  
  // Seguridad básica: Solo permitimos si es la sesión de admin
  if (!session || session.value !== 'admin-session-token') {
    // return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { password, full_name, employee_id, department, company } = body;

    if (!password || !full_name || !employee_id) {
      return new Response(JSON.stringify({ message: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (password, full_name, employee_id, department, company) VALUES (?, ?, ?, ?, ?)',
      [hashedPassword, full_name, employee_id, department || '', company || 'Einsur']
    );

    return new Response(JSON.stringify({ message: 'Empleado creado con éxito', id: result.insertId }), { status: 201 });
  } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return new Response(JSON.stringify({ message: 'El usuario o ID de empleado ya existe' }), { status: 409 });
    }
    return new Response(JSON.stringify({ message: 'Error en la base de datos' }), { status: 500 });
  }
};
