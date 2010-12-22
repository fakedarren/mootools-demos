
window.addEvent('domready', function(){

	new Drag.Move($('drag'), {

		container: $('container'),

		droppables: $$('.drop'),

		onEnter: function(element, droppable){
			droppable.setStyle('background', '#000');
		},

		onLeave: function(element, droppable){
			droppable.setStyle('background', '#F30');
		},

		onDrop: function(element, droppable){
			if (droppable) droppable.setStyle('background', '#FACE8F');
		}

	});

});
