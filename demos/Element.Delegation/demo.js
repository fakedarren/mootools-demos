
window.addEvent('domready', function() {

	// Element.Delegation setup
	$('container').addEvent( 'click:relay(.item)', function() {
		var msg = ( this.hasClass('new') ) ? 'new div clicked!' : 'div clicked!';
		displayOutput( msg );
	});
	
	
	/** added functionality below **/
	
	$('addDiv').addEvent( 'click', function() {
		document.id('container').grab( new Element( 'div', {
				class: 'item new'
			}), 'top'
		);
	});
	
	function displayOutput( msg ) {
		document.id('output').innerHTML = msg;
		(function() { 
			document.id('output').innerHTML = '';
		}).delay( 500 );
	}
});
