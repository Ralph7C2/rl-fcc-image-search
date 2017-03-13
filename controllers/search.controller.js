var Q = require('q');
var request = require('request');
var Query = require('../models/query.js');
service = {};

service.imageSearch = function(query, queryString) {
	var deferred = Q.defer();

	var thisQuery = new Query();
	thisQuery.query = query;
	thisQuery.date = new Date();
	thisQuery.save();

	url = "https://www.googleapis.com/customsearch/v1?key=";
	url+= process.env.GOOGLE_CSE_KEY;
	url+= "&cx="+process.env.CSE_ID;
	url+= "&q="+query+"&searchType=image";
	if(queryString.hasOwnProperty('page') && !isNaN(queryString['page']) && queryString['page']>0) {
		url+="&offset="+((queryString['page']*10)+1);
	} else if(queryString.hasOwnProperty('offset') && !isNaN(queryString['offset']) && queryString['offset']>0) {
		url+="&offset="+queryString['offset'];
	}
	console.log(url);
	results = [];
	request(url, function(err, response, body) {
		if(err) { deferred.reject(err) }
		else {
			if(response.statusCode==200) {
				resp = JSON.parse(body);
				resp['items'].forEach(function(item) {
					obj = {};
					obj.url = item.link;
					obj.alt = item.snippet;
					obj.context = item.image.contextLink;
					results.push(obj);
				});
				deferred.resolve(results);
			} else {
				deferred.reject(response.statusCode);
			}
		}	
	});
	return deferred.promise;
}

service.getLatest= function() {
	var deferred = Q.defer();
	Query.find({}).limit(10).then(function(docs) {
		results = [];
		docs.forEach(function(item) {
			var obj = {};
			obj.query = item.query;
			obj.date = item.date;
			results.push(obj);
		});
		deferred.resolve(results.reverse());
	}).then(function(err) {
		deferred.reject(err);
	});
	return deferred.promise;
}

module.exports = service;