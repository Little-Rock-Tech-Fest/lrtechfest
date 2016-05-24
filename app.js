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

var team = [
	{name: 'Daniel Pollock', imgUrl: '/public/img/team/daniel.png', twitter: 'dpollock', title: 'Lead Developer', company: 'DataPath'},
	{name: 'Abby Sims', imgUrl: '/public/img/team/abby.png', twitter: 'abby_sims', title: 'Owner/Developer', company: 'Idestini Dev Studio'},
	{name: 'Paul Gower', imgUrl: '/public/img/team/paul.png', twitter: 'paulmgower', title: 'Owner/Developer', company: 'Lunamark'},
	{name: 'Kyle Neumeier', imgUrl: '/public/img/team/kyle.png', twitter: 'kneumei', title: 'Software Developer', company: 'CareEvolution'},
	{name: 'Michael Collins', imgUrl: '/public/img/team/michael.png', title: 'Developer', company: 'Arkansas Children\'s Hospital'},
	{name: 'Chris Steven', imgUrl: '/public/img/team/chris.png', twitter: 'chrissteven81', title: 'Software Developer', company: 'Dassault Falcon Jet'},
];

app.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.param("year") + ".pdf", function (err) {
		if (err) {
			res.send(404);
		}
	});
});

app.get("/pastyear/:year", function (req, res) {

	var speakers;
	var year = req.param("year");
	fs_readFile('archive/'+year+'/speakers.json', 'utf8')
		.then(function(speakerData){
			speakers = JSON.parse(speakerData);
			return fs_readFile('archive/'+year+'/sponsors.json', 'utf8');
		}, console.error)
		.then(function(sponsorData){
			var sponsors = JSON.parse(sponsorData);
			res.render('pastyear', {speakers: speakers, sponsors: sponsors, year: year});
		}, console.error);
});


app.get('/sponsors', function(req, res){
	res.render('sponsors');
});

app.get('/about', function(req, res){
	res.render('about', {team: team})
})

app.get('/', function(req, res){
	var sponsors;
	fs_readFile('sponsors.json', 'utf8')
		.then(function(sponsorData){
			sponsors = JSON.parse(sponsorData);
			return fs_readFile('speakers.json', 'utf8');
		})
		.then(function(speakerData){
			var speakers = JSON.parse(speakerData);
			res.render('index', {sponsors: sponsors, team: team, speakers:speakers});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
console.log("starting app on port " + port);
app.listen(port);
