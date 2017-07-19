var express = require('express');
var app = express();
var path= require('path');
var root = process.cwd();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"/","index.html"));
});

app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname,"html","login.html"));
});

app.get('/indexstyles.css', function (req, res) {
    res.sendFile(path.join(__dirname,"css","indexstyles.css"));
});

app.get('/Picture1.png', function (req, res) {
    res.sendFile(path.join(__dirname,"css","Picture1.png"));
});

app.get('/dash.js', function (req, res) {
    res.sendFile(path.join(__dirname,"js","dash.js"));
});

app.get('/register.html', function (req, res) {
    res.sendFile(path.join(__dirname,"html","register.html"));
});

app.get('/getotp.html', function (req, res) {
    res.sendFile(path.join(__dirname,"html","getotp.html"));
});

app.get('/moredetails.html', function (req, res) {
    res.sendFile(path.join(__dirname,"html","moredetails.html"));
});

app.get('/dashboard.html', function (req, res) {
    res.sendFile(path.join(__dirname,"html","dashboard.html"));
});

app.get('/bookdetails.html', function (req, res) {
    //console.log(req.query.isbn);
    res.sendFile(path.join(__dirname,"html","bookdetails.html"));
    
});

app.get('/userdetails.html', function (req, res) {
    //console.log(req.query.user_id);
    res.sendFile(path.join(__dirname,"html","userdetails.html"));
    
});


app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
