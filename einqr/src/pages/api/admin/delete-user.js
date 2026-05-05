import pool from '../../../lib/db';

export const DELETE = async ({ request, cookies }) => {
  const session = cookies.get('admin_session');
  
  if (!session || session.value !== 'admin-session-token') {
    // return new Response(JSON.stringify({ message: 'No autorizado' }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'ID de usuario requerido' }), { status: 400 });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    return new Response(JSON.stringify({ message: 'Empleado eliminado con éxito' }), { status: 200 });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return new Response(JSON.stringify({ message: 'Error en la base de datos' }), { status: 500 });
  }
};
