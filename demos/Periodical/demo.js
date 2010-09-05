var effect = new Fx.Tween('box', {duration: 800});
var periodical;
 
var fx = function() {
	effect.start('background-color', '#6684a0').chain(function() {
		effect.start('background-color', '#bcd965');
	});
}
 
$('start').addEvent('click', function() {
	fx();
	periodical = fx.periodical(1700);
});
 
$('stop').addEvent('click', function() {
	$clear(periodical);
});