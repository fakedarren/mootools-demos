
window.addEvent('domready', () => {

	var result = $('result');

	//We can use one Request object many times.
	var req = new Request({

		url: '/echo/html/',

		onRequest() {
			result.set('text', 'Loading...');
		},

		onSuccess(txt) {
			result.set('text', txt);
		},

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure() {
			result.set('text', 'The request failed.');
		}

	});

	$('makeRequest').addEvent('click', event => {
		event.stop();
		req.send({data: { // our demo runner and jsfiddle will return this as return html
			html: 'The request was successful!'
		}});
	});

	$('failedRequest').addEvent('click', event => {
		event.stop();
		//We can pass new options for our Request object to the send method.
		req.send({url: 'Request/not_here.txt'});
	});

});
