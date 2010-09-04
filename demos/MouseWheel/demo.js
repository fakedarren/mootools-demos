var up = $('up'), down = $('down'), log;
 
[up, down].each(function(arrow) {
	arrow.setStyle('opacity', .1);
});
 
document.addEvent('mousewheel', function(event) {
	event = new Event(event);
 
	/* Mousewheel UP */
	if (event.wheel > 0) {
		up.setStyle('opacity', 1);
		down.setStyle('opacity', .1);
		log = 'up';
	} 
	/* Mousewheel DOWN*/
	else if (event.wheel < 0) {
		up.setStyle('opacity', .1);
		down.setStyle('opacity', 1);
		log = 'down';
	}
 
	$('log').setHTML(log);
 
	var cls = function() {
		[up, down].each(function(arrow) {
			arrow.setStyle('opacity', .1);
		});
	}.delay(100);
});