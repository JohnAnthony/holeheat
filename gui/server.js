var express = require('express');
var app = express();

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('index', {
		api: process.env.API_LOCATION,
		map_key: process.env.MAP_KEY
	});
});

console.log('STARTING SERVER ON PORT ' + process.env.PORT);
app.listen(process.env.PORT);
