//Imports
var express = require('express');
const cors = require('cors')
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var usersCtrl = require('./routes/usersCtrl');



//Instantiate server
var server = express();
server.use(cors())

//Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//Serve API
server.use('/api/', apiRouter);



//Launch server
server.listen(8080, function (params) {
    console.log('serveur en écoute sur 8080 :)');
})

//npx sequelize-cli db:migrate:undo
//npx sequelize-cli db:migrate