import mysql from 'mysql2/promise';

// Pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

// Test opcional de conexión 
pool
  .getConnection()
  .then((connection) => {
    console.log('Conectado a MySQL correctamente');
    connection.release();
  })
  .catch((error) => {
    console.error('Error al conectar con MySQL:', error.message);
  });

export default pool;