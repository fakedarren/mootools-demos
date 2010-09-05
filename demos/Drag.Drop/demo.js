window.addEvent('domready', function(){

	$$('#draggables DIV').each(function(drag){
		
		new Drag.Move(drag, {
			
			droppables: $$('#droppables DIV'),
			
			onDrop: function(draggable, droppable){
				if (droppable){
					draggable.destroy();
					droppable.morph({
						'height': droppable.getStyle('height').toInt() + 30,
						'background-color' : ['#78BA91', '#1D1D20']
					});
				} else {
					draggable.setStyle('background', '#FAEC8F');
				}
			},
			onEnter: function(draggable, droppable){
				droppable.setStyle('background', '#78BA91');
			},
			onLeave: function(draggable, droppable){
				droppable.setStyle('background', '#1D1D20');
			}
			
		});
	 
	});

});