
window.addEvent('domready', function() {

	var output = $('output'),
		container = $('container');

	// Element.Delegation setup
	$('container').addEvent('click:relay(.item)', function(){

		// Check whether it is a new div or not with the Element:hasClass method
		var message = this.hasClass('new') ? 'new div clicked!' : 'div clicked!';
		output.set('text', message);

		(function(){ // clear the message after 500 ms
			output.set('text', '');
		}).delay(500);

	});

	// Add new divs
	$('addDiv').addEvent('click', function(){
		container.grab(new Element('div.item.new'), 'top');
	});

});
