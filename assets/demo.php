<?php

$path = dirname(__FILE__) . '/../demos/' . $_GET['demo'] . '/';

preg_match('/\s*\/\*\s---*(.*?)\s\.\.\.\s*\*\//s', file_get_contents($path . 'demo.details'), $matches);
$header = $matches[1];

preg_match('/\s*\/\*\s---*.*?\s\.\.\.\s*\*\/(.*)/s', file_get_contents($path . 'demo.details'), $matches);
$description = $matches[1];

$html = file_get_contents($path . 'demo.html');
$css = file_get_contents($path . 'demo.css');
$js = file_get_contents($path . 'demo.js');

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>MooTools Demos</title>
	<link href="assets/css/main.css" rel="stylesheet" type="text/css" />
	<link href="assets/css/demos.css" rel="stylesheet" type="text/css" />
</head>

<body>
	
	<div id="header">
		<div>
			<a href="index.php" class="button">Back</a>
			<h1>MooTools</h1>
		</div>
	</div>
	
	<div id="content">

		<a href="http://jsfiddle.net/gh/get/mootools/1.3/fakedarren/mootools-demos/tree/master/demos/<?php echo $_GET['demo']; ?>/" class="button">Edit with jsFiddle</a>
		
		<div id="description">
			<?=$description;?>
		</div>

		<ul class="tabs">
			<li class="selected first">Demo</li>
			<li>CSS</li>
			<li>HTML</li>
			<li>JavaScript</li>
		</ul>
			
		<div class="tabcontent selected">
			<iframe id="demoframe" src="assets/run.php?demo=<?php echo $_GET['demo']; ?>" frameborder="0"></iframe>
		</div>
	
		<div class="tabcontent">
			<textarea id="css"><?php echo $css; ?></textarea>
		</div>

		<div class="tabcontent">
			<textarea id="html"><?php echo htmlspecialchars($html); ?></textarea>
		</div>

		<div class="tabcontent">
			<textarea id="js"><?php echo $js; ?></textarea>
		</div>

	</div>

	<script src="codemirror/js/codemirror.js" type="text/javascript"></script>
	<script src="Source/mootools-core-1.3-full.js" type="text/javascript"></script>
	<script src="Source/mootools-more-1.3-full.js" type="text/javascript"></script>
	<script src="assets/js/demos.js" type="text/javascript"></script>
	
</body>
</html>
