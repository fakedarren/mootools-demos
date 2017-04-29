
window.addEvent('domready', () => {
    var output = $('output');
    var container = $('container');
    var timer;

    // Element.Delegation setup
    container.addEvent('click:relay(.item)', function(){

		// Check whether it is a new div or not with the Element:hasClass method
		var message = this.hasClass('new') ? 'new div clicked!' : 'div clicked!';
		output.set('text', message);

		this.set('tween', {link: 'chain'}).fade(0.5).fade(1);

		clearTimeout(timer);
		timer = ((() => { // clear the message after 1000 ms
			output.set('text', '');
		})).delay(1000);

	});

    // Add new divs
    $('addDiv').addEvent('click', () => {
		container.grab(new Element('div.item.new'), 'top');
	});
});
