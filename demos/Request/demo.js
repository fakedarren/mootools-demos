
window.addEvent('domready', function(){

	//We can use one Request object many times.
	var req = new Request({

		url: 'demos/Request/data.txt',

		onSuccess: function(txt){
			$('result').set('text', txt);
		},

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}

	});

	$('makeRequest').addEvent('click', function(event){
		event.stop();
		req.send();
	});

	$('failedRequest').addEvent('click', function(event){
		event.stop();
		//We can pass new options for our Request object to the send method.
		req.send({url: 'demos/Request/not_here.txt'});
	});

});
