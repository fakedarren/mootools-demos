// first example
$('example1').addEvent('click', function(){
    
    // One of the easiest ways to animate an element is to use the tween method. This won't work with chaining though:
    
    // $('box').tween('top', 100).chain(function(){ ...
    
    // as .tween returns the element, not the Fx instance
    // If you need to chain tweens, this syntax is slightly different.
    
    $('box').get('tween').start('top', 100).chain(function(){
        this.start('left', 200);
    }, function(){
        this.start('top', 80);
    });
    
});


// second example 
$('example2').addEvent('click', function(){

    // This example is essentially the same as above; but we're creating an Fx.Morph instance first so it's easier to set some options, or callbacks
    
    var myFx = new Fx.Morph('box', { duration: 'long' });
    
    myFx.start({
        height: 150,
        width: 150
    }).chain(function(){
        this.start({
            'background-color': '#CCC',
            'border-color': '#000',
            'border-width': '3px'
        });
    });
});

// Third example
$('example3').addEvent('click', function(){
    
    // This last example shows how by setting the 'link' property, MooTools will automatically add any new calls to the chain.
    
    var myFx = new Fx.Morph('box', {
        duration: 'long',
        link: 'chain'    // <-- magic sauce
    });
    
    myFx.start({
        'top': 200,
        'left': 200
    });
    myFx.start({
        'background-color': '#78BA91'
    });
    myFx.start({
        'background-color': '#A87AAD',
        'top': 60,
        'left': 10
    });
    
});


// This just blocks the default link behaviour
$$('a').addEvent('click', function(evt){
    evt.stop();
});