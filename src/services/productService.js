const productRepository = require('../repositories/productRepository');

// Obtener todos los productos
async function getAllProducts() {
  try {
    const products = await productRepository.findAll();
    return products;
  } catch (error) {
    throw new Error('Error en el servicio al obtener productos: ' + error.message);
  }
}

// Obtener un producto por ID
async function getProductById(id) {
  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      throw new Error('El ID del producto debe ser un número válido');
    }

    const product = await productRepository.findById(id);

    // Verificar si el producto existe
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Crear un nuevo producto
async function createProduct(productData) {
  try {
    // Validaciones de negocio
    if (!productData.ProductName || productData.ProductName.trim() === '') {
      throw new Error('El nombre del producto es obligatorio');
    }

    if (!productData.UnitPrice || productData.UnitPrice < 0) {
      throw new Error('El precio del producto debe ser mayor o igual a 0');
    }

    if (productData.UnitsInStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Limpiar datos antes de guardar
    const cleanProductData = {
      ProductName: productData.ProductName.trim(),
      SupplierID: productData.SupplierID || null,
      CategoryID: productData.CategoryID || null,
      QuantityPerUnit: productData.QuantityPerUnit || null,
      UnitPrice: productData.UnitPrice,
      UnitsInStock: productData.UnitsInStock || 0,
      UnitsOnOrder: productData.UnitsOnOrder || 0,
      ReorderLevel: productData.ReorderLevel || 0,
      Discontinued: productData.Discontinued || false
    };

    const newProduct = await productRepository.create(cleanProductData);
    return newProduct;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Actualizar un producto
async function updateProduct(id, productData) {
  try {
    // Validar que el ID sea válido
    if (!id || isNaN(id)) {
      throw new Error('El ID del producto debe ser un número válido');
    }

    // Verificar si el producto existe
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    // Validaciones de negocio
    if (!productData.ProductName || productData.ProductName.trim() === '') {
      throw new Error('El nombre del producto es obligatorio');
    }

    if (productData.UnitPrice < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (productData.UnitsInStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Limpiar datos antes de actualizar
    const cleanProductData = {
      ProductName: productData.ProductName.trim(),
      SupplierID: productData.SupplierID || existingProduct.SupplierID,
      CategoryID: productData.CategoryID || existingProduct.CategoryID,
      QuantityPerUnit: productData.QuantityPerUnit || existingProduct.QuantityPerUnit,
      UnitPrice: productData.UnitPrice,
      UnitsInStock: productData.UnitsInStock || 0,
      UnitsOnOrder: productData.UnitsOnOrder || 0,
      ReorderLevel: productData.ReorderLevel || 0,
      Discontinued: productData.Discontinued || false
    };

    const updatedProduct = await productRepository.update(id, cleanProductData);
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Eliminar un producto
async function deleteProduct(id) {
  try {
    // Validar que el ID sea válido
    if (!id || isNaN(id)) {
      throw new Error('El ID del producto debe ser un número válido');
    }

    // Verificar si el producto existe
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    // Eliminar el producto
    const wasDeleted = await productRepository.deleteById(id);

    if (!wasDeleted) {
      throw new Error('No se pudo eliminar el producto');
    }

    return {
      message: `Producto "${existingProduct.ProductName}" eliminado correctamente`,
      deletedProduct: existingProduct
    //   message: Mensaje de confirmación con el nombre del producto
    //   deletedProduct: El producto que se eliminó (por si el usuario lo necesita)
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};