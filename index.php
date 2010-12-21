<?php
$demo = false;
if (isset($_GET['demo'])){

	$demo = $_GET['demo'];

	// check if the demo is valid
	if (strpos($demo, '/') !== false || !is_dir(dirname(__FILE__) . '/demos/' . $demo)){
		$demo = false;
	} else {

		include dirname(__FILE__) . '/libs/yaml.php';

		$path = dirname(__FILE__) . '/demos/' . $_GET['demo'] . '/';
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

	}
}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>MooTools Demos<?php if (!empty($descriptor['name'])): echo ' - ' . $descriptor['name']; endif; ?></title>
	<link href="assets/css/main.css" rel="stylesheet" type="text/css" />
	<link href="assets/css/demos.css" rel="stylesheet" type="text/css" />
</head>

<body>

	<div id="header">
		<div>
			<h1>MooTools</h1>
		</div>
	</div>

	<div id="content">
		<div id="leftcolumn">
			<ul>
				<li><a href="?"><strong>Demos</strong></a></li>
		<?php
		if ($handle = opendir(dirname(__FILE__) . '/demos/')){
		    while (false !== ($folder = readdir($handle))){
		        if ($folder != "." && $folder != ".."){
					?><li><a href="?demo=<?php echo $folder; ?>"><?php echo $folder; ?></a></li><?php
				}
		    }
		    closedir($handle);
		}
		?>
			</ul>
		</div>
		<div id="rightcolumn">
			<?php if ($demo): ?>

			<form action="http://jsfiddle.net/api/post/mootools/1.3/dependencies/more,art/" method="post">

				<button type="submit" class="button">Edit with jsFiddle</button>

				<div id="description">
					<?php if (!empty($descriptor['name'])): echo '<h2>' . $descriptor['name'] . '</h2>'; endif; ?>
					<?php if (!empty($description)): echo $description; endif; ?>
				</div>

				<ul class="tabs">
					<li class="selected first">Demo</li>
					<?php if (!empty($descriptor['docs'])): ?>
					<li>Docs</li>
					<?php endif; ?>
					<li>CSS</li>
					<li>HTML</li>
					<li>JavaScript</li>
				</ul>

				<div class="tabcontent selected">
					<iframe id="demoframe" src="assets/run.php?demo=<?php echo $_GET['demo']; ?>" frameborder="0"></iframe>
				</div>

				<?php if (!empty($descriptor['docs'])): ?>
				<div class="tabcontent">
					<h3>Documentation References:</h3>
					<ul class="doc_references">
					<?php foreach ($descriptor['docs'] as $doc): ?>
						<li><a href="<?php echo $doc['url']; ?>"><?php echo $doc['name']; ?></a></li>
					<?php endforeach; ?>
					</ul>
				</div>
				<?php endif; ?>

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


			<?php else: ?>
			<h2>MooTools Demos</h2>

			<p>The demos are here to give you some examples of how MooTools works. Demos can be opened in <a href="http://jsfiddle.net">jsFiddle</a> for editing, and you can <a href="https://github.com/fakedarren/mootools-demos">download the entire demo runner here</a>.</p>

			<p>We hope you enjoy our demos.</p>
			<p>The MooTools Development Team.</p>
			<?php endif; ?>
		</div>
	</div>

</body>
</html>
