//Imports
var express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var usersCtrl = require('./routes/usersCtrl');
const http = require('http');
const socketIO = require('socket.io'); //Import pour les notifications




//Instantiate server
var server = express();
server.use(cors())

//Instantiate notifications
const notif = http.createServer(server);
const io = socketIO(notif);

// Gérez les connexions des clients
io.on('connection', (socket) => {
    console.log('Nouvelle connexion client');

    // Gérez les notifications
    socket.on('notification', (data) => {
        // Traitement de la notification
        console.log('Nouvelle notification :', data);

        // Diffusez la notification à  tous les clients connectés
        io.emit('notification', data);
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Serveur écoutant sur le port" ,${PORT});
});


//Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//Serve API
server.use('/api/', apiRouter);



//Launch server
server.listen(8080, function (params) {
    console.log('serveur en écoute :)');
})

//npx sequelize-cli db:migrate:undo
//npx sequelize-cli db:migrate