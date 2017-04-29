
window.addEvent('domready', () => {
    var up = $('up');
    var down = $('down');
    var arrows = $$(up, down);
    var log;

    arrows.setStyle('opacity', 0.1);

    document.addEvent('mousewheel', event => {

		/* Mousewheel UP */
		if (event.wheel > 0){
			up.setStyle('opacity', 1);
			down.setStyle('opacity', 0.1);
			log = 'up';
		}
		/* Mousewheel DOWN*/
		else if (event.wheel < 0){
			up.setStyle('opacity', 0.1);
			down.setStyle('opacity', 1);
			log = 'down';
		}

		$('log').set('html', log);

		var cls = (() => {
			arrows.setStyle('opacity', 0.1);
		}).delay(100);
	});
});
