export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { user, pass } = body;

    // Usuario de Sistemas solicitado por el usuario
    if (user === 'sistemas' && pass === 'esusistemas123') {
      cookies.set('admin_session', 'active-admin-session', { 
        path: '/', 
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 8 // 8 horas de sesión admin
      });
      
      return new Response(JSON.stringify({ message: 'Bienvenido, Sistemas' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Acceso Denegado: Usuario o Clave incorrectos' }), { status: 401 });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error interno' }), { status: 500 });
  }
};
