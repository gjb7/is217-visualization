var path = require('path'),
	fs = require('fs'),
	csv = require('csv'),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient;

var csvFiles = [
//	path.join(__dirname, 'data', 'words', 'obamaromneyWords.csv'),
	path.join(__dirname, 'data', 'words', 'romneyWords.csv'),
	path.join(__dirname, 'data', 'words', 'obamaWords.csv')
];

var tweetDirs = [
	path.join(__dirname, 'data', 'tweets', 'from_obama'),
	path.join(__dirname, 'data', 'tweets', 'from_romney'),
	path.join(__dirname, 'data', 'tweets', 'obama'),
	path.join(__dirname, 'data', 'tweets', 'romney'),
];

function csvArrayToObject(row, headers) {
	var object = {};
	
	for (var i = 0; i < headers.length; i++) {
		object[headers[i]] = row[i];
	}
	
	return object;
}

MongoClient.connect('mongodb://localhost/is217-visualization', function(err, db) {
	if (err) {
		console.log(err);
		
		return;
	}
	
	var wordCollection = db.collection('words');
	
	csvFiles.forEach(function(filePath) {
		var fileName = path.basename(filePath, path.extname(filePath));
		var headers = null;
		
		csv()
		.from.path(filePath, { 'header': true })
		.on('record', function(row, index) {
			if (!headers) {
				headers = row;
				
				return;
			}
			
			var object = csvArrayToObject(row, headers);
			
			var word = object.words;
			
			object.owner = fileName;
			
			wordCollection.insert(object, function(err, item) {
				if (err) {
					console.log(err);
				}
			});
		})
		.on('end', function() {
			console.log('Done with ' + fileName);
		});
	});
	
	var tweetCollection = db.collection('tweets');
	
	tweetDirs.forEach(function(filePath) {
		fs.readdir(filePath, function(err, items) {
			items.forEach(function(item) {
				if (path.extname(item) != '.json') {
					return;
				}
				
				var contents = fs.readFileSync(path.join(filePath, item));
				
				try {
					var tweets = JSON.parse(contents).results;
				}
				catch (e) {
					return;
				}
				
				if (!tweets) {
					return;
				}
				
				var tweetCount = tweets.length;
				
				function decrementTweetCount() {
					tweetCount--;
					
					if (tweetCount == 0) {
						console.log('Done with ' + path.join(filePath, item));
					}
				}
				
				tweets.forEach(function(tweet) {
					tweetCollection.findOne({ 'id_str': tweet.id_str }, function(err, item) {
						if (err) {
							decrementTweetCount();
							
							return;
						}
						
						if (item) {
							decrementTweetCount();
							
							return;
						}
						
						tweetCollection.insert(tweet, function() {
							decrementTweetCount();
						});
					});
				});
			});
		});
	});
});
	