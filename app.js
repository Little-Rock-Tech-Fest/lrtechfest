var express = require('express');
var fs = require('fs');
var app = express();

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

app.get("/call", function(req, res){
	res.render('call')
});

app.get("/sponsors", function(req, res){
	res.render('become_sponsor');
});

app.get("/become-sponsor", function(req, res){
	res.render('become_sponsor')
});

app.get("/venue", function (req, res) {
	res.render('venue')
});

app.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.param("year") + ".pdf", function (err) {
		if (err) {
			res.send(404);
		}
	});
});

app.get("/speakers", function (req, res) {
	fs.readFile('speakers.json', 'utf8', function (err, data) {
		if (err) {
			console.log(error);
		} else {
			var speakers = JSON.parse(data);
			res.render('speakers', { speakers: speakers });
		}
	});
	
});

app.get('/', function(req, res){
	res.render('index')
});

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
app.listen(port);
