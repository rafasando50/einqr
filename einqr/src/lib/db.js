import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Asegurar que cargamos el .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('Intentando conectar a DB en:', process.env.DB_HOST);

const pool = mysql.createPool({
  host: '127.0.0.1', // Forzamos IP local
  user: 'root',
  password: '',
  database: 'einqr',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
