window.addEvent('domready', function() {
	var container = document.id('container'), // cache sort container
		sorter = new Fx.Sort($$('#container .sort'), { // setup sort object
				"duration": document.id('duration').value,
				"transition": Fx.Transitions[document.id('fxTransition').value][document.id('fxEase').value],
				"mode": "vertical",
				onComplete: function() {
					displayDOM() ;
				}
			});
	
	displayDOM();

	$$('.fireSort').addEvent('click', function(e) {
            e.preventDefault();
            //sort based on text of element that was clicked (forward, backward, reverse)
            sorter[this.get('text')]();
        }
	);
	
	document.id('order').addEvent('click', function(e) {
            e.preventDefault();
            alert(sorter.currentOrder);
        }
	);
	
	document.id('reorderDOM').addEvent('click', function(e) {
            e.preventDefault();
            sorter.rearrangeDOM();
            displayDOM();
        }
	);
	
	document.id('mode').addEvent('change', function() {
        sorter.rearrangeDOM(); //rearrange DOM first so that elements stack properly
        sorter.options.mode = (this.checked) ? "vertical":"horizontal";
        container.toggleClass('container');
        displayDOM();
	});
	
	document.id('swap').addEvent('click', function(e) {
            e.preventDefault();
            var elems = container.getChildren();
            sorter.swap(elems[0], elems[elems.length-1]);
        }
	);
	
	document.id('sort').addEvent('click', function(e) {
            e.preventDefault();
            sorter.sort([1,3,0,2,4]);
        }
	);
	
	document.id('fxTransition').addEvent('change', function() {
		sorter.options.transition = Fx.Transitions[document.id('fxTransition').value][document.id('fxEase').value];
	});
	
	document.id('fxEase').addEvent('change', function() {
		sorter.options.transition = Fx.Transitions[document.id('fxTransition').value][document.id('fxEase').value];
	});
	
	document.id('duration').addEvent('keyup', function() {
		sorter.options.duration = this.value.toInt();
	});
	
	//helper function, displays the DOM visually to see how the sort effects it
	function displayDOM() {
        var str = '';
        container.getChildren().each( function(item) {
            str += '<div style="'+item.style.cssText+'">'+item.get('text')+'</div>\r\n';
        });
        document.id('output').set('text',  str);
	}
});
