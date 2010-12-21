<?php

include dirname(__FILE__) . '/../libs/yaml.php';

$path = dirname(__FILE__) . '/../demos/' . $_GET['demo'] . '/';
$details = file_get_contents($path . 'demo.details');

preg_match('/\/\*\s*^---(.*?)^\.\.\.\s*\*\/(.*)/ms', $details, $matches);

$descriptor = array();

if (!empty($matches)){
	$descriptor = YAML::decode($matches[1]);
	$description = $matches[2];
}

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
			<a href="?" class="button">Back</a>
			<h1>MooTools</h1>
		</div>
	</div>

	<form id="content" action="http://jsfiddle.net/api/post/mootools/1.3/dependencies/more,art/" method="post">

		<button type="submit" class="button">Edit with jsFiddle</button>

		<div id="description">
			<?php if (!empty($descriptor['name'])): echo '<h2>' . $descriptor['name'] . '</h2>'; endif; ?>
			<?php if (!empty($description)): echo $description; endif; ?>
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
			<textarea id="css" name="css"><?php echo $css; ?></textarea>
		</div>

		<div class="tabcontent">
			<textarea id="html" name="html"><?php echo htmlspecialchars($html); ?></textarea>
		</div>

		<div class="tabcontent">
			<textarea id="js" name="js"><?php echo $js; ?></textarea>
		</div>

	</form>

	<script src="codemirror/js/codemirror.js" type="text/javascript"></script>
	<script src="Source/mootools-core-1.3-full.js" type="text/javascript"></script>
	<script src="Source/mootools-more-1.3-full.js" type="text/javascript"></script>
	<script src="assets/js/demos.js" type="text/javascript"></script>

</body>
</html>
