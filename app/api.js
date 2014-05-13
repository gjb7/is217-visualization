module.exports = function(app) {
	var mongo = app.get('mongo'),
		tweetsCollection = mongo.collection('tweets'),
		wordsCollection = mongo.collection('words');
	
	tweetsCollection.ensureIndex({ text: 'text' }, function(err) {
		if (err) {
			throw err;
		}
		
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
		
		app.get('/api/words/weights', function(req, res) {
			wordsCollection.find({ 'average occurrences' : { $gt : '0.75' } }).toArray(function(err, words) {
				if (err) {
					res.json(500, { 'error': err });
				}
				else {
					var normalizedWords = {};
					
					words.forEach(function(value) {
						if (value.words in normalizedWords) {
							normalizedWords[value.words] += Number(value['average occurrences']);
						}
						else {
							normalizedWords[value.words] = Number(value['average occurrences']);
						}
					});
					
					var weights = [];
					
					for (var word in normalizedWords) {
						weights.push([ word, normalizedWords[word] ]);
					}
					
					weights.sort(function(a, b) {
						if (a[1] < b[1]) {
							return 1;
						}
						else if (a[1] > b[1]) {
							return -1;
						}
						
						return 0;
					});
					
					res.json(weights);
				}
			});
		});
		
		app.get('/api/tweet/:word', function(req, res) {
			mongo.command({ text: 'tweets', search: req.params.word }, function(err, object) {
				if (err) {
					res.json(500, { 'error': err });
				}
				else {
					var results = object.results;
					var tweet = results[Math.floor(Math.random() * results.length)].obj;
					
					res.json(tweet);
				}
			});
		});
	});
};