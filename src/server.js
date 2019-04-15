const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); //Importação do CORS

const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box)
    })
})

//Configurando conexão com banco de dados
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-hpt01.mongodb.net/omnistack?retryWrites=true',
{
    useNewUrlParser: true,
});
//Configuração do CORS
app.use(cors());

//Configura o recebimento no formato de json
app.use(express.json());

//Middleware
app.use((req, res, next) =>{
    req.io = io;

    return next();
});

//Permite o envio de arquivos
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

//Rotas
app.use(require('./routes'));

server.listen(process.env.PORT || 3333);