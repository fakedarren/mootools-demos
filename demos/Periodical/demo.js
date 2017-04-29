
window.addEvent('domready', () => {
    var effect = new Fx.Tween('box', {duration: 800});
    var periodical;

    // Create the function wich will run the effect
    var fx = () => {
		effect.start('background-color', '#6B7B95').chain(() => {
			effect.start('background-color', '#E79D35');
		});
		// return this function, so you could do fx() which returns fx,
		//or fx()()() which still returns fx and runs the function 3 times
		return fx;
	};

    $('start').addEvent('click', event => {
		event.stop();
		// We call the fx function once directly, which returns the fx function again, and set the periodical to 1.7 seconds
		// We store the reference to the peridical in the peridical, so we can stop it later
		periodical = fx().periodical(1700);
	});

    $('stop').addEvent('click', event => {
		event.stop();
		// With the JavaScipt function clearInterval we can stop the interval
		clearInterval(periodical);
	});
});
