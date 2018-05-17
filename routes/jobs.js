var express = require('express');
var router = express.Router();

var fs = require('fs');
var Q = require('q');

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

router.get('/', function (req, res) {
	var jobs;
	fs_readFile('jobs.json', 'utf8')
		.then(function(jobData){
			jobs = JSON.parse(jobData);
			res.render('jobs', {jobs: jobs});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

router.get('/detail/:id', function (req, res) {
	var jobs;
	var id = req.params.id;
	fs_readFile('jobs.json', 'utf8')
		.then(function(jobsData){
			jobs = JSON.parse(jobsData);
			res.render('jobDesc', {jobs: jobs, id: id});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

module.exports = router;