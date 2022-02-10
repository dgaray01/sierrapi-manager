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
//const mg = mailgun({apiKey: api_key, domain: DOMAIN});


app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});


app.get('/about', function(req, res) {
  res.render('pages/about');
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

