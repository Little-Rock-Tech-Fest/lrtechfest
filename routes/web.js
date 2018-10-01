var express = require('express');
var router = express.Router();

//topics route
var fs = require('fs');
var Q = require('q');

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

var slugs = require('slugs');
var _ = require('lodash');

var team = JSON.parse(fs.readFileSync('team.json', 'utf8'));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

router.get('/', function(req, res){
	var speakerJson = require('../speakers.json');
	var speakers = [];
	for (speaker in speakerJson) {
   		speakers.push(speakerJson[speaker]);
	}
	shuffle(speakers);
	speakers = speakers.slice(0, 4);
	var sponsors = require('../sponsors.json');
	var photos = require('../gallery.json');
	res.render('index', {title: 'Little Rock Tech Fest', speakers:speakers, sponsors:sponsors, photos:photos, team:team});
});

router.get('/gametime', function(req, res){

	var speakers = JSON.parse(fs.readFileSync('speakers.json', 'utf8'));

	var times = {
		'1' : '8',
		'2' : '9', 
		'3' : '10',
		'4' : '1', 
		'5' : '2', 
		'6' : '3', 
		'7' : '4', 
	};

	var rooms = {
		'1' : 'A',
		'2' : 'B',
		'3' : 'C',
		'4' : 'E',
	};

	var presentations = [];

	speakers.forEach(function(speaker){
		speaker.slug = slugs(speaker.FirstName+'-'+speaker.LastName);
		speaker.Presentations.forEach(function (presentation) {
			presentation.SpeakerId = speaker.Id;
			presentation.SpeakerName = speaker.FirstName + " " + speaker.LastName;

			//update json to match moment.js
			if (presentation.Day === 1) {
				presentation.PresentationDay = 4; //thursday
			} else {
				presentation.PresentationDay = 5; //friday
			}

			//update json to match moment.js (or loop)
			if (presentation.SessionNumber === 1) {
				presentation.PresentationHour = 8;
			}
			if (presentation.SessionNumber === 2) {
				presentation.PresentationHour = 9;
			}
			if (presentation.SessionNumber === 3) {
				presentation.PresentationHour = 10;
			}
			if (presentation.SessionNumber === 4) {
				presentation.PresentationHour = 1;
			}
			if (presentation.SessionNumber === 5) {
				presentation.PresentationHour = 2;
			}
			if (presentation.SessionNumber === 6) {
				presentation.PresentationHour = 3;
			}
			if (presentation.SessionNumber === 7) {
				presentation.PresentationHour = 4;
			}

			//update in json (or loop)
			if (presentation.Room === "1") {
				presentation.PresentationRoom = 'A';
			}
			if (presentation.Room === "2") {
				presentation.PresentationRoom = 'B';
			}
			if (presentation.Room === "3") {
				presentation.PresentationRoom = 'C';
			}
			if (presentation.Room === "4") {
				presentation.PresentationRoom = 'E';
			}

			if (presentation.Day) {
				var timeId =  presentation.Day.toString() + "-" + presentation.SessionNumber;
				presentation.Time = times[timeId];
			}
			presentation.ElementId = "schedule_day"+presentation.Day+"_room"+_.kebabCase(presentation.Room,' ','_')+"_time"+presentation.SessionNumber;
			presentation.SpeakerSlug = speaker.slug;
			presentations.push(presentation);
		});
	});
	var sponsors = require('../sponsors.json');
	var photos = require('../gallery.json');
	res.render('gametime', {
		title: 'Little Rock Tech Fest', 
		times: times, 
		rooms: rooms,
		speakers: speakers, 
		sponsors: sponsors, 
		team: team
	});
});

router.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.params.year + ".pdf", function (err) {
		if (err) {
			res.status(404).render('404');
		}
	});
});

router.get('/event', function(req, res) {
	res.render('event');
});

/* these be redirects */
router.get('/index-w-speakers', function(req, res) {
	res.redirect('/');
});
router.get('/resources', function(req, res){
	res.redirect('/event');
});
router.get('/resources-review', function(req, res) {
	res.redirect('/event');
});
router.get('/topics', function(req, res) {
	res.redirect('/speakers');
});

module.exports = router;