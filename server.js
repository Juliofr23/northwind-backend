const express = require('express');
const cors = require('cors');
const { getConnection } = require('./src/config/database');
require('dotenv').config();

// Crear aplicación Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API de Northwind!',
    status: 'API funcionando correctamente',
    version: '1.0.0'
  });
});

// Ruta para probar conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT TOP 5 * FROM dbo.Products');
    
    res.json({
      message: 'Conexión exitosa a la base de datos',
      totalProductos: result.recordset.length,
      productos: result.recordset
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_DATABASE}`);
  console.log('=================================');
});