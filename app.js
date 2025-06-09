const express = require('express');
const session = require('express-session')
const PORT = 3000;

//simular base de dados de utilizadores

bdusers = [
    { username: "pedro", password: "12345", nick: "pedrão"},
    { username: "paulo", password: "54321" , nick : "paulinho"},
    ];

const app = new express();
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(session({ secret: "12345" }));


app.post('/login', (req, res) => {
    dadoslogin = req.body;
    console.log(dadoslogin);
    const user = bdusers.find((element) => element.username === dadoslogin.username)
    if (user && user.password === dadoslogin.password) {
        // login com sucesso
        req.session.user = user.username;
        res.redirect('/protected');
    } else {
        // falhou login
        res.redirect('/login.html')
    }
})

app.listen(PORT, () => {
    console.log("o servidor está a funcionar na porta : " + PORT);
})