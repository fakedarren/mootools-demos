
var editors = {

	html: CodeMirror.fromTextArea('html_tab', {
	    parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
		stylesheet: ["assets/codemirror/css/xmlcolors.css", "assets/codemirror/css/jscolors.css", "assets/codemirror/css/csscolors.css"],
		height: "dynamic",
	    path: "assets/codemirror/js/",
	    autoMatchParens: true,
		readOnly: true
	}),

	js: CodeMirror.fromTextArea('js_tab', {
	    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
	    stylesheet: "assets/codemirror/css/jscolors.css",
		height: "dynamic",
	    path: "assets/codemirror/js/",
	    autoMatchParens: true,
		readOnly: true
	}),

	css: CodeMirror.fromTextArea('css_tab', {
	    parserfile: "parsecss.js",
	    stylesheet: "assets/codemirror/css/csscolors.css",
		height: "dynamic",
	    path: "assets/codemirror/js/",
	    autoMatchParens: true,
		readOnly: true
	})

};

var tabs = $$('.tabs LI.tab'),
	content = $$('.tabcontent');

tabs.each(function(tab, index){
	tab.addEvent('click', function(){
		tabs.removeClass('selected');
		content.removeClass('selected');
		tabs[index].addClass('selected');
		content[index].addClass('selected');
		for (var name in editors) if (editors.hasOwnProperty(name)) editors[name].setDynamicHeight();
	});
});
