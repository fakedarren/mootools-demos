var drop = $('cart');
var dropFx = drop.effect('background-color', {wait: false}); // wait is needed so that to toggle the effect,
 
$$('.item').each(function(item){
 
	item.addEvent('mousedown', function(e) {
		e = new Event(e).stop();
 
		var clone = this.clone()
			.setStyles(this.getCoordinates()) // this returns an object with left/top/bottom/right, so its perfect
			.setStyles({'opacity': 0.7, 'position': 'absolute'})
			.addEvent('emptydrop', function() {
				this.remove();
				drop.removeEvents();
			}).inject(document.body);
 
		drop.addEvents({
			'drop': function() {
				drop.removeEvents();
				clone.remove();
				item.clone().inject(drop);
				dropFx.start('7389AE').chain(dropFx.start.pass('ffffff', dropFx));
			},
			'over': function() {
				dropFx.start('98B5C1');
			},
			'leave': function() {
				dropFx.start('ffffff');
			}
		});
 
		var drag = clone.makeDraggable({
			droppables: [drop]
		}); // this returns the dragged element
 
		drag.start(e); // start the event manual
	});
 
});