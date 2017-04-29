
window.addEvent('domready', () => {

	$$('.item').addEvent('mousedown', function(evt){

		evt.stop();

		var clone = this.clone().setStyles(this.getCoordinates()).setStyles({
				'opacity': 0.7,
				'position': 'absolute'
			}).inject(document.body);

 		var shirt = this;

		var drag = new Drag.Move(clone, {

			droppables: $('cart'),

			onDrop(dragging, cart) {

				dragging.destroy();

				if (cart != null){
					shirt.clone().inject(cart);
					cart.highlight('#7389AE', '#FFF');
				}
			},
			onEnter(dragging, cart) {
				cart.tween('background-color', '#98B5C1');
			},
			onLeave(dragging, cart) {
				cart.tween('background-color', '#FFF');
			}
		});
		drag.start(evt);
	});

});
