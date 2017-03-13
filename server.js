require('dotenv').load();
var express = require('express');
var app = express();
var search = require('./controllers/search.controller.js');
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var configDB = require('./config/database.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);

var morgan = require('morgan');
app.use(morgan('dev'));

app.get('/', function(req, res) {
	res.sendfile(__dirname+'/public/index.html');
});

app.get('/api/imagesearch/:searchTerm', function(req, res) {
	search.imageSearch(req.params['searchTerm'], req.query).then(function(results) {
		res.json(results);
	}).fail(function(err) {
		res.json({fail:'Failed to get results', error: err});
	});
});

app.get('/api/latest/imagesearch', function(req, res) {
	search.getLatest().then(function(results) {
		res.json(results);
	}).fail(function(err) {
		res.json({fail:"Failed to get latest queries", error: err});
	});
});

app.listen(port, function() {
	console.log("Ready to rock on port "+port);
});