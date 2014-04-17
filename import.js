var path = require('path'),
	csv = require('csv'),
	mongo = require('mongodb'),
	MongoClient = mongo.MongoClient;



var DATA_TYPES = ['ANS', 'AFR', 'ALR', 'CDEPC', 'CGERIE', 'EOE', 'EOHP', 'GII', 'GIIV'];
var YEARS = ['1980', '1990', '2000', '2005', '2006', '2007', '2008', '2009', '2010'];

MongoClient.connect('mongodb://localhost/is217-visualization', function(err, db) {
	
	
	if (err) {
		console.log(err);
		
		return;
	}
	
	var collection = db.collection('data');
	
	csv()
		.from.path(path.join(__dirname, 'data', 'Data1.csv'))
		.on('record', function(row, index) {
			if (index < 3) {
				// One of MANY column rows. Skip the ones we don't care about.
				return;
			}
			
			var columnIndex = 0;
			
			var data = {
				"country": row[columnIndex++],
			};
			
			DATA_TYPES.forEach(function(type) {
				data[type] = {};
				
				YEARS.forEach(function(year) {
					data[type][year] = row[columnIndex++];
				});
			});
			
			collection.insert(data, function(err, doc) {
				if (err) {
					console.log("error inserting '" + data.country + "': " + err);
				}
				else {
					console.log('inserted ' + data.country);
				}
			});
		});
});
	