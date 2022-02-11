/*
SierraPI Server-Manager

Makesa website that we can access privately or public 
depending on your router settings, this is a website
that manages your SierraPI configuration.
*/
var express = require('express');
var app = express();
const mailgun = require("mailgun-js");
const DOMAIN = 'YOUR_DOMAIN_NAME';
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const sessionExpire = 1000 * 60 * 60 * 24;
//const mg = mailgun({apiKey: api_key, domain: DOMAIN});
app.use(sessions({
    secret: "sierrapisecret",
    saveUninitialized:true,
    cookie: { maxAge: sessionExpire },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

var session;

const password = 'admin123'

app.use(express.static("views"));
app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.render("index")
    }else
    res.render('login')
});

app.post('/user',(req,res) => {
    if("root" == "root" && req.body.password == password){
        session=req.session;
        session.userid="root";
        console.log(req.session)
        res.redirect("/")
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/settings',(req,res) => {
    session=req.session;
    if(session.userid){
        res.render("settings")
    }else
    res.render('login')
});
	


app.listen(8080);
console.log('Server is listening on port 8080');

/*
const data = {
	from: 'Excited User <me@samples.mailgun.org>',
	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});
*/

