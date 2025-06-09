const express = require('express');
const PORT = 3000;

//simular base de dados de utilizadores

bdusers = [
    { username: "pedro", password: "12345", nick: "pedrão"},
    { username: "paulo", password: "54321" , nick : "paulinho"},
    ];

const app = new express();
app.use(express.urlencoded());

app.use(express.static('public'));

app.post('/login', (req, res) => {
    dadoslogin = req.body;
    console.log(dadoslogin);
    const user = bdusers.find((element) => element.username === dadoslogin.username)
    console.log(user);
})

app.listen(PORT, () => {
    console.log("o servidor está a funcionar na porta : " + PORT);
})