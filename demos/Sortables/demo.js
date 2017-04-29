
window.addEvent('domready', () => {
    var example1 = $('example1');
    var step = 0;

    example1.getElements('li').each(li => {
		var color = [step, 82, 87].hsbToRgb();
		li.setStyles({
			'background-color': color,
			height: Number.random(20, 50)
		});
		step += 35;
	});

    new Sortables(example1);

    new Sortables('#example2 UL', {
		clone: true,
		revert: true,
		opacity: 0.7
	});
});
