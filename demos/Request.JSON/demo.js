
window.addEvent('domready', function() {

	var images_path = 'demos/Request.JSON/images/';
	var gallery = $('gallery');

	var addImages = function(images){
		images.each(function(image){
			var el = new Element('div.preview'),
				name = new Element('h3', {'html': image.name}).inject(el),
				desc = new Element('span', {'html': image.description}).inject(name, 'after'),
				img = new Element('img', {'src': images_path + image.src}).inject(desc, 'after'),
				footer = new Element('span').inject(img, 'after');

			if (image.views > 50 && image.views < 250) footer.set({'html': 'popular', 'class': 'popular'});
			else if (image.views > 250) footer.set({'html': 'SUPERpopular', 'class': 'SUPERpopular'});
			else footer.set({'html': 'normal', 'class': 'normal'});

			el.inject(gallery);
		});
	};

	$('loadJSON').addEvent('click', function(e){
		e.stop();

		var request = new Request.JSON({
			url: 'demos/Request.JSON/data.json',
			onComplete: function(jsonObj) {
				addImages(jsonObj.previews);
			}
		}).send();
	});

	$('clearJSON').addEvent('click', function(e){
		e.stop();
		gallery.empty();
	});

});