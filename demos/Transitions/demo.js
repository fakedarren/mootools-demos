
window.addEvent('domready', function(){

	var target = $('target');
	var fx = new Fx.Morph(target, {
		duration: 1000,
		link: 'chain'
	});

	var box = $('box');

	target.setStyles({
		top: box.getTop(),
		left: box.getLeft()
	});

	var selectTransition = $('fxTransition'),
		selectEase = $('fxEase'),
		durationInput = $('duration'),
		result = $('result');

	$$(selectEase, selectTransition).addEvent('change', function(){
		var transition = selectTransition.get('value');

		if (transition == 'linear'){
			fx.options.transition = Fx.Transitions.linear;
			transition = 'Fx.Transitions.linear';
		} else {
			var ease = selectEase.get('value');
			fx.options.transition = Fx.Transitions[transition][ease];
			transition = 'Fx.Transitions.' + transition + '.' + ease;
		}
		result.set('html', transition);

	});

	selectEase.fireEvent('change');

	durationInput.addEvent('keyup', function(){
		fx.options.duration = parseFloat(durationInput.get('value'));
	});

	box.addEvent('mousedown', function(event){
		event.stop();
		fx.start({
			top: [event.page.y - 25],
			left: [event.page.x - 25]
		});
	});

});

