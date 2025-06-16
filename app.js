const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const {MongoClient, ObjectId} = require('mongodb');


dotenv.config(); // Carrega variáveis de ambiente do ficheiro .env

// todo: declarar como variavel de ambiente (.env)
//const PORT = 3000;
const PORT = process.env.PORT || 3000;


// todo: declarar como variavel de ambiente (.env)
// const SECRET = "12345"
const SECRET = process.env.SESSION_SECRET || "12345";


//simular base de dados de utilizadores
// todo : migrar pata bd mongo (ou outra)
// todo : não armazenar passwords em texto simples => usar hash function
bdusers = [
    { username: "pedro", password: "12345", nick: "pedrão", color:"yellow"},
    { username: "paulo", password: "54321" , nick : "paulinho", color:"lightblue"},
    ];

const app = new express();                  // nova app
app.use(express.urlencoded());              // extrai dados urlencoded dos pedidos
app.use(express.static('public'));          // pasta static para servidor estático
app.use(session({ secret: SECRET, resave: false, saveUninitialized : false }));       // 

// configurar render engine de templates
app.set('view engine', 'ejs');              // define ejs como template engine
app.set('views', 'views');                  // pasta views para templates.ejs


// middleware de verificação de autenticação
function estaAutenticado(req, res, next) {
    if (req.session.user) {                 // se está autenticado
        next();                             // continua para o próximo
    } else {
        res.redirect('/login.html')         // senão redireciona para login.html
    }
}

// login
app.post('/login', async (req, res) => {
    dadoslogin = req.body;
    console.log(dadoslogin);

    // verificar se o utilizador existe na base de dados mongodb

    user = await usersCollection.findOne({ username: dadoslogin.username });
    console.log(user);

    if (user) {
        // se o utilizador existe, verificar a password
        if (user.password === dadoslogin.password) {
            // login com sucesso
            req.session.user = user.username;
            req.session.nick = user.nick;
            req.session.color = user.color;
            console.log("sucesso");
            res.redirect('/protected');
        } else {
            // falhou login
            console.log("insucesso: password incorreta");
            res.redirect('/login.html');
        }
    }


    // verificar se o utilizador existe na base de dados simulada
    /*
    const user = bdusers.find((element) => element.username === dadoslogin.username)
    if (user && user.password === dadoslogin.password) {
        // login com sucesso
        req.session.user = user.username;
        req.session.nick = user.nick;
        req.session.color = user.color;
        console.log("sucesso")
        res.redirect('/protected');
    }
        else {
        // falhou login
        console.log("insucesso");
        res.redirect('/login.html')
    } */
});

// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// exemplo de rotas com middlewarewa de autenticação
app.get('/ola', estaAutenticado ,(req, res) => {
    res.send("ola" +  " " + req.session.user)  
})

app.get('/protected', estaAutenticado,(req, res) => {
        res.render('viewprotected', { nick: req.session.nick , color: req.session.color});
});

let db;
let usersCollection;

// liga bd e servidor
async function startServer() {
    try {
        // Conectar ao MongoDB

        console.log(process.env.MONGOURL)
        const client = new MongoClient(process.env.MONGOURL);

        await client.connect();

        db = client.db('usersdb');
        usersCollection = db.collection('users');


        console.log("Conectado ao MongoDB");
        // Iniciar o servidor Express
        // liga servidor
        app.listen(PORT, () => {
            console.log("o servidor está a funcionar na porta : " + PORT);
            })
    } catch (error) {
        console.error("Erro ao inicializar:", error);
    }
}

startServer()
