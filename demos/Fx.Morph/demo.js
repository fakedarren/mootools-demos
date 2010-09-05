window.addEvent('domready', function(){
		
	$$('LI').set('morph', {
		duration: 200,
		wait: false
	});
	
	$$('LI').addEvents({
		'mouseenter': function(){
			this.morph({
				'background-color': '#666',
				'color': '#FF8',
				'margin-left': 5
			});
		},
		'mouseleave': function(){
			this.morph({
				'background-color': '#333',
				'color': '#888',
				'margin-left': 0
			});
		}
	});

});