var express = require('express');
var app = express();

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

app.get("/call", function(req, res){
	res.render('call')
});

app.get("/sponsors", function(req, res){
	res.render('sponsor_list')
});

app.get("/become-sponsor", function(req, res){
	res.render('become_sponsor')
});

app.get('/', function(req, res){
	res.render('index')
});

var port = Number(process.env.PORT || 9990);
app.listen(port);
