
var editors = [];

editors['html'] = CodeMirror.fromTextArea('html', {
    parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
	stylesheet: ["assets/codemirror/css/xmlcolors.css", "assets/codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
	height: "dynamic",
    path: "assets/codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

editors['css'] = CodeMirror.fromTextArea('css', {
    parserfile: "parsecss.js",
    stylesheet: "assets/codemirror/css/csscolors.css",
	height: "dynamic",
    path: "assets/codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

editors['js'] = CodeMirror.fromTextArea('js', {
    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
    stylesheet: "assets/codemirror/css/jscolors.css",
	height: "dynamic",
    path: "assets/codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

var tabs = $$('.tabs LI.tab');
var content = $$('.tabcontent');

tabs.each(function(tab, index){
	tab.addEvent('click', function(){
		tabs.removeClass('selected');
		content.removeClass('selected');
		tabs[index].addClass('selected');
		content[index].addClass('selected');
	});
});