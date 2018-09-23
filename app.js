var express = require('express');
var path = require('path');

var fs = require('fs');
var slugs = require('slugs');
var _ = require('lodash');

var webRouter = require('./routes/web');
var scheduleRouter = require('./routes/schedule');
var sponsorRouter = require('./routes/sponsors');
var speakerRouter = require('./routes/speakers');
var eventRouter = require('./routes/events');
var jobRouter = require('./routes/jobs');

var app = express();

app.locals.moment = require('moment');
app.locals.converter = require('number-to-words');
app.locals.slugs = require('slugs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/schedule', scheduleRouter);
app.use('/sponsors', sponsorRouter);
app.use('/speakers', speakerRouter);
app.use('/pastyear', eventRouter);
app.use('/jobs', jobRouter);
app.use('/', webRouter); //general URIs

app.use(function (req, res, next) {
  res.status(404).render('404');
});

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
console.log("starting app on port " + port);
app.listen(port);
