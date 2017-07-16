var _ = require('underscore');
var express = require('express');
var app = express();

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
	coordinates: { type: [Number], index: { type: '2d', sparse: true } },
	strata: [{
		formation: String,
		depth: Number
	}]
}));

 

var TODO = function(req, res) {
	return res.status(501).send('TODO');
};

app.put('/borehole', TODO);

app.get('/borehole', function(req, res) {
	Borehole.find(function(err, boreholes) {
		if (err)
			return res.status(500).send(err);
		res.json(boreholes);
	});
});

app.put('/borehole/:id', TODO);

app.post('/borehole/:id', TODO);

app.delete('/borehole/:id', TODO);

app.get('/borehole/:id/yield/:length/:hours', function(req, res) {
	var length = Number(req.params.length);
	var hours = Number(req.params.hours);

	if ([1800, 2400].indexOf(hours) == -1)
		return res.status(500).send('Invalid hours value');

	if (length <= 0)
		return res.status(500).send('Invalid wellbore length');

	Borehole.findOne({ _id: req.params.id }, function(err, b) {
		if (err)
			return res.status(500).send(err);

		var yield = 0;
		var key = 'h' + hours;

		var promises = _.map(b.strata, function(s) {
			return Formation.findOne({ _id: s.formation	});
		});
		Promise.all(promises).then(function(formations) {
			_.each(formations, function(e, i) {
				if (length <= 0)
					return;

				var yield_set = e[key];
				var mean_yield = (yield_set.min + yield_set.max) / 2;
				var l = Math.min(b.strata[i].depth, length);

				length -= l;
				yield += mean_yield * l;
			})
			res.send(String((yield * hours) / 1000));
		});
	});
});

app.get('/borehole/search/:north/:east', function(req, res) {
	var north = Number(req.params.north);
	var east = Number(req.params.east);

	Borehole.findOne({ coordinates: {$near: [north, east]}}, function(err, b) {
		if (err)
			return res.status(500).send(err);
		res.json(b);
	});
});

app.put('/formation', TODO);

app.get('/formation', function(req, res) {
	Formation.find(function(err, formations) {
		if (err)
			return res.status(500).send(err);
		res.json(formations);
	});
});

app.put('/formation/:id', TODO);

app.post('/formation/:id', TODO);

app.delete('/formation/:id', TODO);



conn.on('error', console.error.bind(console, 'connection error:'));  
conn.once('open', function() {
	console.log('Connection open. Starting API interface.');
	console.log('STARTING SERVER ON PORT ' + process.env.PORT);
	app.listen(process.env.PORT);
});
