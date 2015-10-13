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
	{name: 'Daniel Pollock', imgUrl: '/public/img/team/daniel.png', twitter: 'dpollock'},
	{name: 'Abby Sims', imgUrl: '/public/img/team/abby.png', twitter: 'abby_sims'},
	{name: 'James Climer', imgUrl: '/public/img/team/james.png', twitter: 'jaclimer'},
	{name: 'Paul Gower', imgUrl: '/public/img/team/paul.png', twitter: 'paulmgower'},
	{name: 'Kyle Neumeier', imgUrl: '/public/img/team/kyle.png', twitter: 'kneumei'},
	{name: 'Michael Collins', imgUrl: '/public/img/team/michael.png'},
	//{name: 'Kimberly Harris', imgUrl: '/public/img/team/kimberly.png'},
	{name: 'Chris Steven', imgUrl: '/public/img/team/chris.png', twitter: 'chrissteven81'},
	//{name: 'Matt Shull', imgUrl: '/public/img/team/matt.png', twitter: 'themattshull'},
];

function getRoomName(roomId) {
	switch (roomId) {
		case "1": return "Fulton";
		case "2": return "Pope";
		case "3": return "Izard";
		case "4": return "Miller";
	}	
}

function getTimeForSession(sessionId) {
	switch (sessionId) {
		case "1": return "9:10 AM";
		case "2": return "10:10 AM";
		case "3": return "11:10 AM";
		case "4": return "1:30 PM";
		case "5": return "2:30 PM";
		default: return "3:30 PM";
	}	
}

function organizeSpeakersIntoSessions(speakerData) {
	return _(speakerData).sortBy(function(speaker) {
			return speaker.Presentations[0].Session;
		}).reduce(function(carry, speaker) {
			for (i = 0; i < speaker.Presentations.length; i++) { 	
				var presentation = speaker.Presentations[i];
				var session = presentation.Session;
				var room = presentation.Room;
				var name = speaker.FirstName + ' ' + speaker.LastName;

				if (!carry[session]) {
					carry[session] = {
						rooms: {},
					};

					carry[session].time = getTimeForSession(session);
				}
				var rooms = carry[session].rooms;

				if (rooms[room]) {
					rooms[room].names.push(name);
				} else {
					rooms[room] = {
						Photo: speaker.Photo,
						Description: presentation.Description,
						RoomName: getRoomName(presentation.Room),
						names: [name],
						PresTitle: presentation.Topic,
						DetailId: name.replace(' ', '-'),
					}
				}

				rooms[room].Name = rooms[room].names.join(', ');
			}
			return carry;
		}, {});
}


app.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.param("year") + ".pdf", function (err) {
		if (err) {
			res.send(404);
		}
	});
});

app.get("/2014", function (req, res) {

	var speakers;

	fs_readFile('archive/2014/2014-speakers.json', 'utf8')
		.then(function(speakerData){
			speakers = JSON.parse(speakerData);
			return fs_readFile('archive/2014/2014-sponsors.json', 'utf8');
		}, console.error)
		.then(function(sponsorData){
			var sponsors = JSON.parse(sponsorData);
			res.render('2014', {speakers: speakers, sponsors: sponsors});
		}, console.error);
});

app.get('/speakers', function(req, res){
	res.render('speakers');
});

app.get('/sponsors', function(req, res){
	res.render('sponsors');
});

app.get('/speakerdetails', function(req, res){
	fs_readFile('speakers.json', 'utf8')
		.then(function(speakerData){
			var speakers = JSON.parse(speakerData);
			res.render('speakerdetails', {speakers:speakers});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

app.get('/about', function(req, res){
	res.render('about', {team: team})
})
app.get('/schedule', function(req, res){
	fs_readFile('speakers.json', 'utf8')
		.then(function(speakerData){
			var speakers = JSON.parse(speakerData);

			var schedule = organizeSpeakersIntoSessions(speakers);

			res.render('schedule', {schedule:schedule});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

app.get('/sessiondetails', function(req, res){
		fs_readFile('speakers.json', 'utf8')
		.then(function(speakerData){
			var speakers = JSON.parse(speakerData);
			var schedule = organizeSpeakersIntoSessions(speakers);
			var sessionId = req.query.session;
			var talks = schedule[sessionId].rooms;
			
			var sessionStartTime = getTimeForSession(sessionId);
			
			res.render('sessiondetails', {talks: talks, sessionId: sessionId, sessionStartTime: sessionStartTime});
		})
		.catch(function(e){
			console.log(e);
			res.render('500');
		});
});

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
