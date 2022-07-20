class messagesContainer{
  constructor(dbMariadb, tableName){
    try {
      this.dbMariadb = dbMariadb;
      this.tableName = tableName;
      dbMariadb.schema.hasTable(tableName).then(function(exists) {
        if (!exists) {
          return dbMariadb.schema.createTable(tableName, table => {
            table.increments('id').primary()
            table.string('email',50)
            table.float('timeChat')
            table.string('message')
          });
        }})  
        console.log('tabla creada', tableName)
    } catch (error) {
      console.log(error)
    }
  }

  // obtener todos los mensajes
  async getAll(){
    const messages = await this.dbMariadb.from(this.tableName).select('*');
    return messages
  }

  // crear nuevo mensaje
  async newMessage(email, timeChat, message){
    const objMessage = {
      email,
      timeChat,
      message
    }
    await this.dbMariadb.from(this.tableName).insert(objMessage)
  }
}

module.exports = {
  messagesContainer
}