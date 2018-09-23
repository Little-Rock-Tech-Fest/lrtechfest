var express = require('express');
var router = express.Router();

var fs = require('fs');
var Q = require('q');
var slugs = require('slugs');
var _ = require('lodash');

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

var speakers = JSON.parse(fs.readFileSync('speakers.json', 'utf8'));
//var sponsors = JSON.parse(fs.readFileSync('sponsors.json', 'utf8'));
var rooms = ['1','2','3','4']
var times = {
	'1' : '9', 
	'2' : '10', 
	'3' : '11',
	'4' : '1', 
	'5' : '2', 
	'6' : '3', 
};
var presentations = [];

speakers.forEach(function(speaker){
	speaker.slug = slugs(speaker.FirstName+'-'+speaker.LastName);
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
	res.render('schedule', {speakers: speakers, rooms: rooms, times: times});
});

module.exports = router;