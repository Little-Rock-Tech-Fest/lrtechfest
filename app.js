var express = require('express');
var _ = require('lodash')._;
var slugs = require('slugs');
var fs = require('fs');
var app = express();
app.locals._ = _;


app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

app.get("/call", function(req, res){
	res.redirect('speakers')
});

app.get("/agenda", function(req, res){
	fs.readFile('speakers.json', 'utf8', function(err, data){
		if(err){
			console.log(err);
		}else{
			var speakers = JSON.parse(data);
			var talks = [];
			_.each(speakers, function(speaker){
				_.each(speaker.Presentations, function(presentation){
					var foundPresentation = _.find(talks, {Topic: presentation.Topic});
					if(foundPresentation){
						foundPresentation.Speakers.push(speaker.FirstName + " " + speaker.LastName);
					}else{
						presentation.Speakers = [];
						var speakerName = speaker.FirstName + " " + speaker.LastName;
						presentation.Speakers.push(speakerName);
						presentation.Url = '/speakers#'+slugs(speakerName);
						presentation.UID = speaker.Id + "." + presentation.Id;
						talks.push(presentation);
					}
				});
			});
			res.render('schedule', {presentations:talks})
		}
	});
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
			_.each(speakers, function(speaker){
				speaker.Slug = slugs(speaker.FirstName + " " + speaker.LastName);
			});
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
