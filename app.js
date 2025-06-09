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

// configurar render engine de templates
app.set('view engine', 'ejs');
app.set('views','views');

app.post('/login', (req, res) => {
    dadoslogin = req.body;
    console.log(dadoslogin);
    const user = bdusers.find((element) => element.username === dadoslogin.username)
    if (user && user.password === dadoslogin.password) {
        // login com sucesso
        req.session.user = user.username;
        console.log("sucesso")
        res.redirect('/protected');

    } else {
        // falhou login
        console.log("insucesso");
        res.redirect('/login.html')
    }
});

app.get('/protected', (req, res) => {
    if (req.session.user) {
        //res.send("isto está protegido " + req.session.user);
        res.render('viewprotected', { username: req.session.user });

    } else {
        res.redirect('/login.html');
    }
});

app.listen(PORT, () => {
    console.log("o servidor está a funcionar na porta : " + PORT);
})