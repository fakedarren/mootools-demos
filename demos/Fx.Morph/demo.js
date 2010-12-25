
window.addEvent('domready', function(){

	var lis = $$('#idList LI');

	lis.set('morph', {
		duration: 200
	})

	lis.addEvents({

		mouseenter: function(){
			this.morph({
				'background-color': '#666',
				'color': '#FF8',
				'margin-left': 5
			});
		},

		mouseleave: function(){
			this.morph({
				'background-color': '#333',
				'color': '#888',
				'margin-left': 0
			});
		}

	});

});
