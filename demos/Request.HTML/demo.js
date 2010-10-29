window.addEvent('domready', function() {
	
	new Request.HTML({
		
		url: '/mootools-demos/demos/Request.HTML/demo.response.html',
		
		onComplete: function(response){
			alert(response);
		}
		
	}).send();

});
