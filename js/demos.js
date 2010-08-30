
CodeMirror.fromTextArea('html', {
    parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
	stylesheet: ["codemirror/css/xmlcolors.css", "codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

CodeMirror.fromTextArea('css', {
    parserfile: "parsecss.js",
    stylesheet: "codemirror/css/csscolors.css",
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});

CodeMirror.fromTextArea('js', {
    parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
    stylesheet: "codemirror/css/jscolors.css",
	height: "dynamic",
    path: "codemirror/js/",
    autoMatchParens: true,
	readOnly: true
});
