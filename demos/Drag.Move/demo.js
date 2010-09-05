window.addEvent('domready', function(){
	
	var drag = new Drag.Move($('dragger'), {
	
		'container': $('containment'),
		'droppables': $$('.dropper'),
	
		'onEnter': function(element, droppable){
			droppable.setStyle('background-color', '#000');
		},
		'onLeave': function(element, drop){
			droppable.setStyle('background-color', '#F30');
		},
		'onDrop': function(element, droppable){
			if (droppable) droppable.setStyle('background-color', '#FACE8F');
		}
	});
	 
});