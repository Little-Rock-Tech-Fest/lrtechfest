var express = require('express');
var router = express.Router();

//topics route
var fs = require('fs');
var slugs = require('slugs');
var _ = require('lodash');

router.get('/', function(req, res){
	res.render('index', { 
		title: 'Little Rock Tech Fest' 
	});
});

router.get('/resources', function(req, res){
	res.render('resources');
});

router.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.params.year + ".pdf", function (err) {
		if (err) {
			res.status(404).render('404');
		}
	});
});

module.exports = router;