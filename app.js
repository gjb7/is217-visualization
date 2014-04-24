var path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
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
	
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(bodyParser());
	
	app.listen(app.get('port'));
	console.log('Started server on port ' + app.get('port') + '.');
});
