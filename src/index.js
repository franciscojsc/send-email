const express = require('express');
const request = require('request');
const rp = require('request-promise');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    const recaptchaClient = process.env.CAPTCHA_CLIENT;
    res.render('home', {
        recaptchaClient
    });
});

app.get('/error', (req, res) => {
    res.render('error');
});

app.get('/sucess', (req, res) => {
    res.render('sucess');
});

app.post('/send', async (req, res) => {

    const recaptchaServer = process.env.CAPTCHA_SERVER;

    if (!!recaptchaServer) {
        const recaptchaResultClient = req.body['g-recaptcha-response'];
        const ipConnection = req.connection.remoteAddress;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaServer}&response=${recaptchaResultClient}&remoteip=${ipConnection}`;

        const verificationRecaptcha = JSON.parse(await rp(url));

        if (!verificationRecaptcha.success) {
            return res.redirect('/error');
        }
    }

    const userReplayToEmail = req.body.email;
    const textEmail = req.body.message;
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

    transport.sendMail({
        from: userEmail,
        to: userEmail,
        replyTo: userReplayToEmail,
        subject: 'New message of send-email app',
        text: textEmail
    }).then(info => {
        res.redirect('/sucess');
    }).catch(err => {
        res.redirect('/error');
    });
});

const port = process.env.PORT | 3000;

app.listen(port, () => {
    console.log(`Running on port ${port}!`);
});