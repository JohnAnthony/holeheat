var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connect(process.env.MONGODB, {
	useMongoClient: true
});
var conn = mongoose.connection;             

var Formation = mongoose.model('Formation', mongoose.Schema({
	category: String,
	h1800: { min: Number, max: Number },
	h2400: { min: Number, max: Number }
}));

var Borehole = mongoose.model('Borehole', mongoose.Schema({
	east: Number,
	north: Number,
	strata: [{
		formation: String,
		depth: Number
	}]
}));

 
var app = express();

var TODO = function(req, res) {
	res.status(501);
	res.send('TODO');
};

app.put('/borehole', TODO);

app.get('/borehole', function(req, res) {
	Borehole.find(function(err, boreholes) {
		if (err) {
			res.status(500);
			res.send(err);
		}
		res.json(boreholes);
	});
});

app.put('/borehole/:id', TODO);

app.post('/borehole/:id', TODO);

app.delete('/borehole/:id', TODO);

app.get('/borehole/:id/yield', TODO);

app.get('/borehole/search/:north/:east', TODO);

app.put('/formation', TODO);

app.get('/formation', TODO);

app.put('/formation/:id', TODO);

app.post('/formation/:id', TODO);

app.delete('/formation/:id', TODO);



conn.on('error', console.error.bind(console, 'connection error:'));  
conn.once('open', function() {
	console.log('Connection open. Starting API interface.');
	app.listen(8080);
});
