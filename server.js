var express = require('express');
var app = express();
var root = process.cwd();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('images'));

app.get('/', function (req, res) {
    res.sendFile("index.html", {root});
});

app.get('/login.html', function (req, res) {
    res.sendFile("login.html", {root});
});

app.post('/register.html', function (req, res) {
    res.sendFile("register.html", {root});
});

app.post('/getotp.html', function (req, res) {
    res.sendFile('getotp.html',{root});
});

app.post('/moredetails.html', function (req, res) {
    res.sendFile('moredetails.html',{root});
});

app.post('/dashboard.html', function (req, res) {
    res.sendFile('dashboard.html',{root});
});


app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
