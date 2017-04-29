
// We add the "equalize" and "setRandom" methods to Elements
Elements.implement({

	equalize(property) {
        var sum = 0;
        var length = i = this.length;
        while (i--) sum += this[i].getDimensions()[property];
        var average = Math.round(sum / length);
        i = length;
        while (i--) this.tween(property, average);
        return this;
    },

	setRandom(property, min, max) {
        var i = this.length;
        var value;
        while (i--){
			value = Math.round(min + (max - min) * Math.random());
			this[i].tween(property, value);
		}
        return this;
    }

});

window.addEvent('domready', () => {
    var els = $$('div.element');
    var i = false;

    $('link').addEvent('click', event => {
		event.stop();

		i = !i

		if (i) els.equalize('height');
		else els.setRandom('height', 30, 100);
	});
});
