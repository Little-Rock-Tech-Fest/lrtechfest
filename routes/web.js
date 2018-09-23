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

router.get('/', function(req, res){
	var speakers = require('../speakers.json');
	var sponsors = require('../sponsors.json');
	var photos = require('../gallery.json');
	res.render('index', {title: 'Little Rock Tech Fest', speakers:speakers, sponsors:sponsors, photos:photos, team:team});
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

router.get('/index-w-speakers', function(req, res) {
	res.redirect('/');
});
router.get('/resources', function(req, res){
	res.redirect('/event');
});
router.get('/resources-review', function(req, res) {
	res.redirect('/event');
});

module.exports = router;