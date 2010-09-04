var fx = [];
 
$$('#draggables div').each(function(drag){
	new Drag.Move(drag, {
		droppables: $$('#droppables div')
	});
 
	drag.addEvent('emptydrop', function(){
		this.setStyle('background-color', '#faec8f');
	});
});
 
$$('#droppables div').each(function(drop, index){
	fx[index] = drop.effects({transition:Fx.Transitions.Back.easeOut});
	drop.addEvents({
		'over': function(el, obj){
			this.setStyle('background-color', '#78ba91');
		},
		'leave': function(el, obj){
			this.setStyle('background-color', '#1d1d20');
		},
		'drop': function(el, obj){
			el.remove();
			fx[index].start({
				'height': this.getStyle('height').toInt() + 30,
				'background-color' : ['#78ba91', '#1d1d20']
			});
		}
	});
});
 