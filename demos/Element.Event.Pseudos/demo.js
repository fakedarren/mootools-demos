
window.addEvent('domready', function() {
	// `once` psuedo event provided by mootools-more
	document.id('clickOnce').addEvent('click:once', function(){
		alert('you clicked me');
	});
	
	// user defined psuedo event added
	Event.definePseudo('ctrlKey', function(split, fn, args){
		if( ! args[0].event.ctrlKey ) return;
		fn.apply(this, args);
	});
	
	// apply the psuedo event to some elements
	$$('.item').addEvent( 'click:ctrlKey', function() {
		this.toggleClass('active');
	});
});
