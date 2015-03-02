var express = require('express');
var _ = require('lodash')._;
var fs = require('fs');
var Q = require('q');
var app = express();

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

app.locals._ = _;

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

app.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.param("year") + ".pdf", function (err) {
		if (err) {
			res.send(404);
		}
	});
});


app.get("/2014", function (req, res) {

	var speakers;

	fs_readFile('archive/2014/2014-speakers.json', 'utf8')
		.then(function(speakerData){
			speakers = JSON.parse(speakerData);
			return fs_readFile('archive/2014/2014-sponsors.json', 'utf8');
		}, console.error)
		.then(function(sponsorData){
			var sponsors = JSON.parse(sponsorData);
			res.render('2014', {speakers: speakers, sponsors: sponsors})
		}, console.error);
});

app.get('/speakers', function(req, res){
	res.render('speakers');
})

app.get('/sponsors', function(req, res){
	res.render('sponsors');
})


app.get('/', function(req, res){
	fs_readFile('sponsors.json', 'utf8')
		.then(function(sponsorData){
			var sponsors = JSON.parse(sponsorData);
			res.render('index', {sponsors: sponsors});		
		}, console.error)
	
});

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
app.listen(port);
