
window.addEvent('domready', () => {
    var textarea = $('myTextarea');
    var log = $('log');

    // We define the highlight morph we're going to
    // use when firing an event
    var highlight = new Fx.Morph(log, {
		duration: 1500,
		link: 'cancel',
		transition: 'quad:out'
	});

    // Here we start adding events to textarea.
    // Note that 'focus' and 'keyup' are native events, while 'burn'
    // is a custom one we've made
    textarea.addEvents({
		focus() {
			// When focusing, if the textarea contains value "Type here", we
			// simply clear it.
			if (textarea.value.contains('Type here')) textarea.set('value', '');
		},

		keyup() {
			// When user keyups we check if there are any of the magic words.
			// If yes, we fire our custom event burn with a different text for each one.
			if 	(textarea.value.contains('hello')) textarea.fireEvent('burn', 'hello world!');
			else if (textarea.value.contains('moo')) textarea.fireEvent('burn', 'mootools!');
			else if (textarea.value.contains('pizza')) textarea.fireEvent('burn', 'Italy!');
			else if (textarea.value.contains('burn')) textarea.fireEvent('burn', 'fireEvent');
			// note that in case of 'delayed', we are firing the event 1 second late.
			else if (textarea.value.contains('delayed')) textarea.fireEvent('burn', "I'm a bit late!", 1000);
		},

		burn(text) {
			// When the textarea contains one of the magic words
			// we reset textarea value and set the log with text
			textarea.set('value', '');
			log.set('html', text);

			// then we start the highlight morphing
			highlight.start({
				backgroundColor: ['#fff36f', '#fff'],
				opacity: [1, 0]
			});
		}
	});
});
