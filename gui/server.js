var express = require('express');
var app = express();

app.use('/css', express.static(__dirname + '/css'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('index', {
		api: process.env.API_LOCATION
	});
});

console.log('STARTING SERVER ON PORT ' + process.env.PORT);
app.listen(process.env.PORT);
