var droppables = $$('div.dropper');
 
var container = $('containment');
 
new Drag.Move('dragger', {'container': container, 'droppables': droppables});
 
droppables.addEvent('over', function(){
	this.setStyle('background-color', '#000');
});
 
droppables.addEvent('leave', function(){
	this.setStyle('background-color', '#ff3300');
});
 
droppables.addEvent('drop', function(){
	this.setStyle('background-color', '#face8f');
});