$('makeRequest').addEvent('click', function(event){
	event.stop();

	new Request.HTML({

		url: '../demos/Request.HTML/demo.response.php',

		onRequest: function(){
			$('result').set('text', 'loading...');
		},

		onComplete: function(response){
			$('result').empty().adopt(response);
		}

	}).send();

});
