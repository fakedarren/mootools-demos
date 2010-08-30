<?

$path = dirname(__FILE__) . '/demos/' . $_GET['demo'] . '/';

preg_match('/\s*\/\*\s---*(.*?)\s\.\.\.\s*\*\//s', file_get_contents($path . 'demo.details'), $matches);
$header = $matches[1];

$html = file_get_contents($path . 'demo.html');
$css = file_get_contents($path . 'demo.css');
$js = file_get_contents($path . 'demo.js');

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>MooTools Demos</title>
</head>

<body>
	
	<iframe src="run.php?demo=<?=$_GET['demo'];?>"></iframe>
	
	<h2>HTML</h2>
	<textarea id="html"><?=$html?></textarea>
	<hr />
	
	<h2>CSS</h2>
	<textarea id="css"><?=$css;?></textarea>
	<hr />
	
	<h2>JavaScript</h2>
	<textarea id="js"><?=$js;?></textarea>
	<hr />
	
	<script src="codemirror/js/codemirror.js" type="text/javascript"></script>
	<script src="js/demos.js" type="text/javascript"></script>
	
</body>
</html>
