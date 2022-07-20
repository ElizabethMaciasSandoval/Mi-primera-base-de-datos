class productsContainer{
  constructor(dbMariadb, tableName){
    try {
      this.dbMariadb = dbMariadb;
      this.tableName = tableName;
      dbMariadb.schema.hasTable(tableName).then(function(exists) {
        if (!exists) {
          return dbMariadb.schema.createTable(tableName, table => {
            table.increments('id').primary()
            table.string('title',50)
            table.float('price')
            table.string('thumbnail')
          });
        }})  
        console.log('tabla creada', tableName)
    } catch (error) {
      console.log(error)
    }
  }
  // obtener producto por ID
  async getById(id){
    const product = await this.dbMariadb.from(this.tableName).where('id', '=', id);
    return product
  }

  // obtener todos los productos
  async getAll(){
    const products = await this.dbMariadb.from(this.tableName).select('*');
    return products
  }

  // agregar producto
  async add(title, price, thumbnail){
    const product = {
      title,
      price,
      thumbnail
    }
    await this.dbMariadb.from(this.tableName).insert(product)
  }

  // actualizar producto
  async update(id, title, price, thumbnail){
    await this.dbMariadb.from(this.tableName).where('id', '=', id).update({
      title: title,
      price: price,
      thumbnail: thumbnail
    })
  }

  // eliminar producto
  async delete(id){
    await this.dbMariadb.from(this.tableName).where('id', '=', id).del()
  }
}

module.exports = {
  productsContainer
}