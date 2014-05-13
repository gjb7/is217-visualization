$(document).ready(function(){ 
	$.getJSON( "api/words/weights", function( data ) {
  		WordCloud($('#canvas')[0], {
  			list: data
  			});
});
});
