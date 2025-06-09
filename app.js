const express = require('express');
const PORT = 3000;

//simular base de dados de utilizadores

bdusers = [
    { username: "pedro", password: "12345" },
    { username: "paulo", password: "54321" },
    ];


const app = new express();
app.use(express.urlencoded());

app.use(express.static('public'));

app.post('/login', (req, res) => {
    dadoslogin = req.body;
    console.log(dadoslogin);
})

app.listen(PORT, () => {
    console.log("o servidor está a funcionar na porta : " + PORT);
})