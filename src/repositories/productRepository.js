const {getConnection, sql} = require('../config/database');

//Obtener todos los productos
async function findAll() {
  try{
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM dbo.Products');
    return result.recordset;
  }catch (error){
    throw new Error('Error al obtener productos: ' + error.message)
  }  
};

// // Obtener un producto por ID
async function findById(id) {
  try{
    const pool = await getConnection();
    const result = await pool.request()
    // 'id'     	Nombre del parámetro
    // sql.Int	  Tipo de dato en SQL Server
    // id	        Valor que viene de tu función
    //.input(nombreParametroSQL, tipoSQL, valorVariableJS)
    .input('id',sql.Int, id)
    .query('SELECT * FROM dbo.Products WHERE ProductID = @id');
    return result.recordset[0];
  }catch(error){
    throw new Error('Error al obtener producto por ID: ' + error.message)
  }
}

// // Crear un nuevo producto
async function create(productData) {
  try{
    const pool = await getConnection();
    const result = await pool.request()
      .input(
        'productName',        // Nombre del parámetro en la query (@productName)
        sql.NVarChar,         // Tipo de dato SQL
        productData.ProductName  // Valor real del objeto productData
      )
      .input('supplierID', sql.Int, productData.SupplierID)
      .input('categoryID', sql.Int, productData.CategoryID)
      .input('quantityPerUnit', sql.NVarChar, productData.QuantityPerUnit)
      .input('unitPrice', sql.Money, productData.UnitPrice)
      .input('unitsInStock', sql.SmallInt, productData.UnitsInStock)
      .input('unitsOnOrder', sql.SmallInt, productData.UnitsOnOrder)
      .input('reorderLevel', sql.SmallInt, productData.ReorderLevel)
      .input('discontinued', sql.Bit, productData.Discontinued || false)
      .query(`
        INSERT INTO dbo.Products 
        (ProductName, SupplierID, CategoryID, QuantityPerUnit, UnitPrice, 
         UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued)
        VALUES 
        (@productName, @supplierID, @categoryID, @quantityPerUnit, @unitPrice,
         @unitsInStock, @unitsOnOrder, @reorderLevel, @discontinued);
        SELECT SCOPE_IDENTITY() AS ProductID;
      `);
      //Al último hace un select SCOPE, por eso es necesario crear la variable result
    const newProductId = result.recordset[0].ProductID;
    return await findById(newProductId);
  } catch (error) {
    throw new Error('Error al crear producto: ' + error.message);
  }
}

// // Actualizar un producto
async function update(id, productData) {
  try{
    const pool = await getConnection();
    await pool.request()
    .input('id', sql.Int, id)
    .input('productName', sql.NVarChar, productData.ProductName)
    .input('supplierID', sql.Int, productData.SupplierID)
    .input('categoryID', sql.Int, productData.CategoryID)
    .input('quantityPerUnit', sql.NVarChar, productData.QuantityPerUnit)
    .input('unitPrice', sql.Money, productData.UnitPrice)
    .input('unitsInStock', sql.SmallInt, productData.UnitsInStock)
    .input('unitsOnOrder', sql.SmallInt, productData.UnitsOnOrder)
    .input('reorderLevel', sql.SmallInt, productData.ReorderLevel)
    .input('discontinued', sql.Bit, productData.Discontinued)
    .request(`
      UPDATE dbo.Products 
      SET 
        ProductName = @productName,
        SupplierID = @supplierID,
        CategoryID = @categoryID,
        QuantityPerUnit = @quantityPerUnit,
        UnitPrice = @unitPrice,
        UnitsInStock = @unitsInStock,
        UnitsOnOrder = @unitsOnOrder,
        ReorderLevel = @reorderLevel,
        Discontinued = @discontinued
      WHERE ProductID = @id
    `);
    return await findById(id);
  } catch (error) {
    throw new Error('Error al actualizar producto: ' + error.message);
  }
}

// // Eliminar un producto
async function deleteById(id) {
  try{
    const pool = await getConnection;
    const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM dbo.Products WHERE ProductID = @id');
    return result.recordset[0] > 0;
  }catch(error){
    throw new Error('Error al eliminar producto: ' + error.message)
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};