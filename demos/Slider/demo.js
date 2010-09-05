window.addEvent('domready', function(){
	
	var slider = new Slider($('slider'), $('slider').getElement('.knob'), {
		steps: 35,
		range: [8],
		onChange: function(value){
			$('fontSize').setStyle('font-size', value);
		}
	});
	slider.set($('fontSize').getStyle('font-size'));
	

	var color = [0, 0, 0];
	
	$$('.advanced.slider').each(function(slider, i){
		new Slider(slider, slider.getElement('.knob'), {
			steps: 255,
			wheel: true,
			onChange: function(){
				color[i] = this.step;
				$('setColor').setStyle('color', color).set('text', color.rgbToHex());
			}
		}).set(0);
	});
});