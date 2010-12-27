window.addEvent('domready', function(){

	var list = $$('#idList LI');

	list.set('morph', {
		duration: 200
	});

	list.addEvents({

		mouseenter: function(){
			// this refers to the element in an event
			this.morph({
				'background-color': '#666',
				'color': '#FF8',
				'margin-left': 5
			});
		},

		mouseleave: function(){
			// this refers to the element in an event
			this.morph({
				'background-color': '#333',
				'color': '#888',
				'margin-left': 0
			});
		}

	});

});
