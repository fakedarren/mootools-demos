
window.addEvent('domready', () => {
    var selector_input = $('selector');
    var searchDOM = $('searchDOM');
    var elements = $('seach_in_here');

    $('selector_list').getElements('a').addEvent('click', function(event){
		event.stop();
		selector_input.set('value', this.get('text'));
		searchDOM.fireEvent('click');
	});

    searchDOM.addEvent('click', () => {
		var selector = selector_input.get('value');
		elements.getElements(selector).highlight();
	});
});
