// configurciones db
const dbMariadbd = require('./config_mariadb');
const dbsqlite = require('./config_sqlite')

// contenedores
const getProductsContainer = require('../controllers/productsContainer')
const contenedorProductos = new getProductsContainer.productsContainer(dbMariadbd, 'productos');
const getMessagesContainer = require('../controllers/messagesContainer')
const contenedorMensajes = new getMessagesContainer.messagesContainer(dbsqlite, 'mensajes')

// configuración servidor
const express =  require('express');
const app = express();
const puerto = process.env.PORT || 8080;
const path = require('path');
const { Server: IOServer } = require('socket.io');
const expressServer = app.listen(puerto, (error) => {
  if(error){
    console.log(`Se produjo un error ${error}`)
  }else{
    console.log(`Servidor escuchando puerto: ${puerto}`)
  }
})
const io = new IOServer(expressServer);


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'/public')))


// servidor
io.on('connection', async socket => {
  console.log('Se conecto un usuario - ID:', socket.id)

  // PRODUCTOS!!!
  const products = await contenedorProductos.getAll();
  io.emit('server:productos', products) // renderizo los productos para todos los sokets

  socket.on('cliente:productos', async (data) => {
    const {title, price, thumbnail} = data; // destructuro la data 
    await contenedorProductos.add(title, price, thumbnail) // con el metodo agregar guardo la data en la db
    const getNewProducts = await contenedorProductos.getAll()
    io.emit('server:productos', getNewProducts) // emito el arreglo con los producots al cliente
  })

  // CHAT!!!
  const messages = await contenedorMensajes.getAll();
  io.emit('server:mensaje', messages) // renderizo los mensajes para todos los sokets

  socket.on('cliente:mensaje', async (data) => {
    const {email, timeChat, message} = data; // destructuro la data 
    await contenedorMensajes.newMessage(email, timeChat, message) // con el metodo nuevo mensaje guardo la data en la db
    const getNewMessages = await contenedorMensajes.getAll();
    console.log(getNewMessages)
    io.emit('server:mensajes', getNewMessages) // emito el arreglo con los mensajes al cliente
  })
})