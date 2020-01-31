const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT | 3000;
const userEmail = process.env.USER_EMAIL;
const passEmail = process.env.PASS_EMAIL;
const hostEmail = process.env.HOST_EMAIL;
const portEmail = process.env.PORT_EMAIL;

const transport = nodemailer.createTransport({
    host: hostEmail,
    port: portEmail,
    auth: {
        user: userEmail,
        pass: passEmail
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/send', (req, res) => {

    transport.sendMail({
        from: userEmail,
        to: 'francisco.jschaves@gmail.com',
        replyTo: 'francisco.jschaves@gmail.com',
        subject: 'Olá seja bem vindo!',
        text: 'Olá, muito obrigado por se cadastrar na nossa plataforma'
    }).then(info => {
        res.send(info);
    }).catch(err => {
        res.send(err);
    })

});

app.listen(port, () => {
    console.log(`Running on port ${port}!`);
})