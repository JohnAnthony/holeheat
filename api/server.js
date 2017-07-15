var _ = require('underscore');
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

app.get('/borehole/:id/yield/:length/:hours', function(req, res) {
	var length = Number(req.params.length);
	var hours = Number(req.params.hours);

	if ([1800, 2400].indexOf(hours) == -1) {
		res.status(500);
		res.send('Invalid hours value');
	}

	if (length <= 0) {
		res.status(500);
		res.send('Invalid wellbore length');
	}

	Borehole.findOne({ _id: req.params.id }, function(err, b) {
		if (err) {
			res.status(500);
			res.send(err);
		}

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

app.get('/borehole/search/:north/:east', TODO);

app.put('/formation', TODO);

app.get('/formation', function(req, res) {
	Formation.find(function(err, formations) {
		if (err) {
			res.status(500);
			res.send(err);
		}
		res.json(formations);
	});
});

app.put('/formation/:id', TODO);

app.post('/formation/:id', TODO);

app.delete('/formation/:id', TODO);



conn.on('error', console.error.bind(console, 'connection error:'));  
conn.once('open', function() {
	console.log('Connection open. Starting API interface.');
	app.listen(8080);
});
