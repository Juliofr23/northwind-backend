const productService = require('../services/productService');

// Obtener todos los productos
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Obtener un producto por ID
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

// Crear un nuevo producto
async function createProduct(req, res) {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// Actualizar un producto
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await productService.updateProduct(id, productData);

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

// Eliminar un producto
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedProduct
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};