module.exports = function(app) {
	var mongo = app.get('mongo'),
		tweetsCollection = mongo.collection('tweets'),
		wordsCollection = mongo.collection('words');
	
	app.get('/api/tweets', function(req, res) {
		tweetsCollection.find().toArray(function(err, tweets) {
			if (err) {
				res.json(500, { 'error': err });
			}
			else {
				res.json({ 'tweets': tweets });
			}
		});
	});
	
	app.get('/api/words', function(req, res) {
		wordsCollection.find().toArray(function(err, words) {
			if (err) {
				res.json(500, { 'error': err });
			}
			else {
				res.json({ 'words': words });
			}
		});
	});
	app.get('/api/map', function(req, res) {
		
				res.json({ 'test': 'testing' });
			
	});
	app.get('/api/maptest', index.index);

};