var express = require('express');
var router = express.Router();

var fs = require('fs');
var Q = require('q');

var fs_readFile = Q.denodeify(fs.readFile);

router.get('/:year/:id', function (req, res) {
	var speakers;
	var id = req.params.id;
	fs_readFile('speakers.json', 'utf8')
		.then(function(speakersData){
			speakers = JSON.parse(speakersData);
			res.render('speakerDesc', {speakers: speakers, id: id});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

module.exports = router;