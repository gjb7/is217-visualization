var path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient,
	app = express();

MongoClient.connect('mongodb://localhost/is217-visualization', function(err, db) {
	if (err) {
		console.log(err);
		
		return;
	}
	
	app.set('port', process.env['PORT'] || 3000);
	
	app.set('mongo', db);
	
	app.use(morgan('short'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(bodyParser());
	app.set('views', __dirname + '/views')
	app.set('view engine', 'jade')
	
	require('./app/api')(app);
	
	app.get('/', function(req, res) {
		res.render("index");
	});
	
	app.listen(app.get('port'));
	console.log('Started server on port ' + app.get('port') + '.');
	
	
});
