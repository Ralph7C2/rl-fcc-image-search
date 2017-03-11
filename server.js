require('dotenv').load();
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
mongoose.promise = global.promise;

var morgan = require('morgan');
app.use(morgan('dev'));

var request = require('request');

app.get('/', function(req, res) {
	res.sendfile(__dirname+'/public/index.html');
});

app.get('/api/imagesearch/:searchTerm', function(req, res) {
	console.log(req.params);
	console.log(req.query);
	url = "https://www.googleapis.com/customsearch/v1?key=";
	url+= process.env.GOOGLE_CSE_KEY;
	url+= "&q=lectures&searchType=image";
	request(url, function(err, response, body) {
		if(err) { console.log(err); }
		else {
			console.log("RESPONSE: "+response);
			console.log(body);
		}	
	});
	res.send(" ");
});

app.get('/api/latest/imagesearch', function(req, res) {
	console.log("Get Latest!");
	res.send(" ");
});

app.listen(port, function() {
	console.log("Ready to rock on port "+port);
});