
window.addEvent('domready', function(){

	var effect = new Fx.Tween('box', {duration: 800}),
		periodical;

	var fx = function() {
		effect.start('background-color', '#6684a0').chain(function() {
			effect.start('background-color', '#bcd965');
		});
		return fx;
	};

	$('start').addEvent('click', function(event){
		event.stop();
		periodical = fx().periodical(1700);
	});

	$('stop').addEvent('click', function(event){
		event.stop();
		clearInterval(periodical);
	});

});
