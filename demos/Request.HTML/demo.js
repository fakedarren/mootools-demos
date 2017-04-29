

window.addEvent('domready', () => {

	$('makeRequest').addEvent('click', event => {
		event.stop();

		new Request.HTML({

			url: '/echo/html/',

			onRequest() {
				$('result').set('text', 'loading...');
			},

			onComplete(response) {
				$('result').empty().adopt(response);
			},

			data: {
				// This is some content that the server will return
				// we pass this only for our demo runner and jsfiddle
				html: '<h3>The Request Was Successful</h3>' +
					'<p>Here is some <em>HTML content</em>.  It\'s pretty neat, isn\'t it?</p>' +
					'<p>It does not have to be a complete page, since the &lt;head&gt; section is already present in the parent page.</p>' +
					'<p>If we had things inside this HTML that needed some MooTools love (the sort of things that go inside the domready event), we would have to call our scripts\' attention to this code manually.</p>'
			}

		}).send();

	});

});
