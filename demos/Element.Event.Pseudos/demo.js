
window.addEvent('domready', function() {

	// `:once` psuedo event provided by mootools-more
	$('clickOnce').addEvent('click:once', function(event){
		event.stop();

		this.set('tween', {
			transition: 'bounce:out',
			duration: 'long'
		}).tween('margin-left', 300);
	});

	// we can define our own pseudo events as well, for example to check for the control key
	Event.definePseudo('ctrl', function(split, fn, args){
		// args[0] is the Event instance
		if(args[0].control) fn.apply(this, args);
	});

	// apply the psuedo event to some elements
	$$('.item').addEvent('click:ctrl', function(){
		this.toggleClass('active');
	});

});
