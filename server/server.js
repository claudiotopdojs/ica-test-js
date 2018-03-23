//Configure Node requirements
var http = require('http'),
    app = require('./config/express');

var server = http.createServer(app);

var api = require('./app/api/');

//Bodyparser to forms
var bodyParser = require('body-parser');

//Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());;

server.listen(3000, function (err) {
    if (err) console.log("Servidor não respondendo");
    console.log('Servidor escutando na porta: ' + this.address().port);
});

var db = require('./database/database');
var products = db.products;

//Create socket
var io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    io.emit('load', products);

    socket.on('product-add', (data) => {
        products.push(data);

        io.emit('load', products);
    });

    socket.on('product-update', data => {
        products[data.index] = {
            'title': data.title, 
            'price': data.price,
            'description': data.description
        }

        io.emit('load', products);
    });

    socket.on('product-delete', (index) => {
        console.log(products[index]);
        products.splice(index, 1);

        io.emit('load', products);
    });
});