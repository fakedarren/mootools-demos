
window.addEvent('domready', () => {

	new Drag.Move($('drag'), {

		container: $('container'),

		droppables: $$('.drop'),

		onEnter(element, droppable) {
			droppable.setStyle('background', '#E79D35');
		},

		onLeave(element, droppable) {
			droppable.setStyle('background', '#6B7B95');
		},

		onDrop(element, droppable) {
			if (droppable) droppable.setStyle('background', '#C17878');
		}

	});

});
