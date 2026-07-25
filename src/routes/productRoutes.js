const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta: GET /api/products
// Descripción: Obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta: GET /api/products/:id
// Descripción: Obtener un producto por ID
router.get('/:id', productController.getProductById);

// Ruta: POST /api/products
// Descripción: Crear un nuevo producto
router.post('/', productController.createProduct);

// Ruta: PUT /api/products/:id
// Descripción: Actualizar un producto
router.put('/:id', productController.updateProduct);

// Ruta: DELETE /api/products/:id
// Descripción: Eliminar un producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;