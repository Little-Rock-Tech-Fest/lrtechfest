var express = require('express');
var router = express.Router();

var fs = require('fs');
var Q = require('q');
var slugs = require('slugs');
var _ = require('lodash');

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

var speakers = JSON.parse(fs.readFileSync('speakers.json', 'utf8'));
var sponsors = JSON.parse(fs.readFileSync('sponsors.json', 'utf8'));
var times = {'1-1': '9:00 AM', '1-2': '10:00 AM', '1-3': '11:00 AM', '1-4':"1:30 PM", '1-5':"2:30 PM", '1-6':"3:30 PM",
			 '2-1': '8:30 AM', '2-2': '9:30 AM', '2-3': '10:30 AM', '2-4':"1:00 PM", '2-5':"2:00 PM", '2-6':"3:00 PM" };
var presentations = [];

speakers.forEach(function(speaker){
	speaker.slug = slugs(speaker.FirstName+'-'+speaker.LastName);
	/*
	var stats = fs.stat('public/'+speaker.Photo, function(err, stats){
		if(err){
			console.log(err);
			speaker.Photo = "/img/speakers/missing.png";
			presentations.Photo = speaker.Photo;
		}
	});
	*/
	speaker.Presentations.forEach(function (presentation) {
		presentation.SpeakerId = speaker.Id;
		presentation.SpeakerName = speaker.FirstName + " " + speaker.LastName;
		presentation.Photo = speaker.Photo;
		if (presentation.Day) {
			var timeId =  presentation.Day.toString() + "-" + presentation.SessionNumber;
			presentation.Time = times[timeId];
		}
		presentation.ElementId = "schedule_day"+presentation.Day+"_room"+_.kebabCase(presentation.Room,' ','_')+"_time"+presentation.SessionNumber;
		presentation.SpeakerSlug = speaker.slug;
		presentations.push(presentation);
	});
});

router.get('/', function (req, res) {
	res.render('topics', {speakers: speakers});
});

module.exports = router;