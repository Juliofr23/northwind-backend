const sql = require('mssql');
require('dotenv').config();

// Configuración con autenticación SQL
const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function getConnection() {
  try {
    if (!pool) {
      console.log('🔄 Conectando a SQL Server...');
      console.log('📍 Servidor:', config.server + ':' + config.port);
      console.log('📊 Base de datos:', config.database);
      console.log('👤 Usuario:', config.user);
      
      pool = await sql.connect(config);
      
      console.log('✅ ¡CONEXIÓN EXITOSA CON AUTENTICACIÓN SQL!');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Conexión cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar:', error.message);
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql
};