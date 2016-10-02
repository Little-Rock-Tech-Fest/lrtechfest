var express = require('express');
var _ = require('lodash')._;
var fs = require('fs');
var Q = require('q');
var app = express();
var slugs = require('slugs')

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

app.locals._ = _;

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

var team = [
	{name: 'Daniel Pollock', imgUrl: '/public/img/team/daniel.png', twitter: 'dpollock', linkedin: 'dpollock68', github: 'dpollock', title: 'Developer', company: 'DataPath'},
	{name: 'Abby Sims', imgUrl: '/public/img/team/abby.png', twitter: 'abby_sims', linkedin: 'abbysims', github: 'asims', title: 'Owner/Developer', company: 'Idestini Dev Studio'},
	{name: 'Paul Gower', imgUrl: '/public/img/team/paul.png', twitter: 'paulmgower', linkedin: 'pmgower', github: 'pmgower', title: 'Owner/Developer', company: 'Lunamark'},
	{name: 'Kyle Neumeier', imgUrl: '/public/img/team/kyle.png', twitter: 'kneumei', linkedin: 'kyle-neumeier-1270728', github: 'kneumei', title: 'Software Developer', company: 'CareEvolution'},
	{name: 'Schell Gower', imgUrl: '/public/img/team/schell.png', twitter: 'schellg', linkedin: 'schell-gower-8771769', title: 'Marketing Consultant', company: 'LunaMarketing'},
	{name: 'Michael Collins', imgUrl: '/public/img/team/michael.png', title: 'Developer', linkedin: 'michael-collins-37553570', github: 'michaeljeffreycollins', company: 'Arkansas Children\'s Hospital'},
	{name: 'Chris Steven', imgUrl: '/public/img/team/chris.png', twitter: 'chrissteven81', linkedin: 'chrissteven81', github: 'chrissteven81', title: 'Software Developer', company: 'Dassault Falcon Jet'}
];

var speakers = JSON.parse(fs.readFileSync('speakers.json', 'utf8'));
var sponsors = JSON.parse(fs.readFileSync('sponsors.json', 'utf8'));
var times = {'1-1': '9:00 AM', '1-2': '10:00 AM', '1-3': '11:00 AM', '1-4':"1:30 PM", '1-5':"2:30 PM", '1-6':"3:30 PM",
			 '2-1': '8:30 AM', '2-2': '9:30 AM', '2-3': '10:30 AM', '2-4':"1:00 PM", '2-5':"2:00 PM", '2-6':"3:00 PM" }
var presentations = [];

speakers.forEach(function(speaker){
	speaker.slug = slugs(speaker.FirstName+'-'+speaker.LastName);
	var stats = fs.stat(__dirname+speaker.Photo, function(err, stats){
		if(err){
			speaker.Photo = "/public/img/speakers/missing.png";
			presentation.Photo = speaker.Photo
		}
	});
	speaker.Presentations.forEach(function(presentation){
		presentation.SpeakerId = speaker.Id
		presentation.SpeakerName = speaker.FirstName + " " + speaker.LastName
		presentation.Photo = speaker.Photo
		var timeId = presentation.Day.toString()+"-"+presentation.SessionNumber;
		presentation.Time = times[timeId];
		presentation.ElementId = "schedule_day"+presentation.Day+"_room"+presentation.Room+"_time"+presentation.SessionNumber;
		presentation.SpeakerSlug = speaker.slug
		presentations.push(presentation);
	});
});

presentations = _.uniq(presentations, 'Topic');

[1,2].forEach(function(day){
	["1","2","3"].forEach(function(room){
		presentations.push({
			Day: day,
			Room: room,
			Topic:"Lunch",
			Description:"Lunch",
			SessionNumber:3.5,
			ElementId:"schedule_day1_room1_timeLunch",
			Time: day === 1? "12:00 PM" : "11:30 AM",
			IconClass : "fa fa-cutlery",
		});
	});
});

presentations.push({
	Day: 1,
	Room: "1",
	Topic:"Opening Remarks",
	Description:"Opening Remarks",
	SessionNumber:0,
	ElementId:"schedule_day1_room1_timeopening",
	Time: "8:30",
	IconClass : "fa fa-microphone",
});

presentations.push({
	Day: 2,
	Room: "1",
	Topic:"Closing Remarks and Prize Giveaway",
	Description:"Closing Remarks and Prize Giveaway",
	SessionNumber:7,
	ElementId:"schedule_day2_room1_timeclosing",
	Time: "4:00",
	IconClass : "fa fa-gift",
});

var presenationsDay1Room1 = _(presentations).filter({'Day': 1, 'Room': "1"}).sortBy("SessionNumber").value();
var presenationsDay1Room2 = _(presentations).filter({'Day': 1, 'Room': "2"}).sortBy("SessionNumber").value();
var presenationsDay1Room3 = _(presentations).filter({'Day': 1, 'Room': "3"}).sortBy("SessionNumber").value();
var presenationsDay2Room1 = _(presentations).filter({'Day': 2, 'Room': "1"}).sortBy("SessionNumber").value();
var presenationsDay2Room2 = _(presentations).filter({'Day': 2, 'Room': "2"}).sortBy("SessionNumber").value();
var presenationsDay2Room3 = _(presentations).filter({'Day': 2, 'Room': "3"}).sortBy("SessionNumber").value();

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

app.get('/resources', function(req, res){
	res.render('resources');
});

app.get('/topics', function(req, res){
	res.render('topics', {speakers: speakers});
});

app.get('/', function(req, res){
	res.render('index', {
			sponsors: sponsors, 
			team: team, 
			speakers:speakers,
			presenationsDay1Room1: presenationsDay1Room1,
			presenationsDay1Room2: presenationsDay1Room2,
			presenationsDay1Room3: presenationsDay1Room3,
			presenationsDay2Room1: presenationsDay2Room1,
			presenationsDay2Room2: presenationsDay2Room2,
			presenationsDay2Room3: presenationsDay2Room3});
});

app.get('/jobs', function(req, res){
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

app.get('/jobs/detail/:id', function(req, res){
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

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
console.log("starting app on port " + port);
app.listen(port);
