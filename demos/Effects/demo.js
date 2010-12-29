
window.addEvent('domready', function() {

	$$('.simple-fx LI').addEvent('click', function(){

		var property = $(this).get('data-property');
		var to = $(this).get('data-value');

		$('element').tween(property, to);

	});


	$('morph-1').addEvent('click', function(){
		$('element').morph({
			'background-color': '#F9F9F9',
			'color': '#C6D880',
			'width': '200px'
		});
	});

	$('morph-2').addEvent('click', function(){
		$('element').morph({
			'background-color': '#B86364',
			'border-width': '1px',
			'border-style': 'solid',
			'border-color': '#f00',
			'height': '45px',
			'opacity': '0.6',
			'width': '100px'
		});
	});

	$('morph-3').addEvent('click', function(){
		$('element').morph('.myClass')
	});


	$('reset').addEvent('click', function(){
		$('element').erase('style');
	});

});
