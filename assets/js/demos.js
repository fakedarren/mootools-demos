
var editors = [];

editors['html'] = CodeMirror.fromTextArea('html', {
    parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
	stylesheet: ["codemirror/css/xmlcolors.css", "codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

editors['css'] = CodeMirror.fromTextArea('css', {
    parserfile: "parsecss.js",
    stylesheet: "codemirror/css/csscolors.css",
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

editors['js'] = CodeMirror.fromTextArea('js', {
    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
    stylesheet: "codemirror/css/jscolors.css",
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

var tabs = $$('.tabs LI');
var content = $$('.tabcontent');

tabs.each(function(tab, index){
	tab.addEvent('click', function(){
		$$(tabs).removeClass('selected');
		$$(content).removeClass('selected');
		tabs[index].addClass('selected');
		content[index].addClass('selected');
	});
});