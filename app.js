var express = require('express');
var app = express();

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

app.get("/call", function(req, res){
	res.render('call')
});

app.get('/', function(req, res){
	res.render('index')
});

 
var port = Number(process.env.PORT || 5000);
app.listen(port);
