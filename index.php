<?php
if (isset($_GET['demo'])){
	require('assets/demo.php');
	exit();
}
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
			<h1>MooTools</h1>
		</div>
	</div>
	
	<div id="content">
		<div id="leftcolumn">
			<ul>
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
			<h2>MooTools Demos</h2>
			
			<p>The demos are here to give you some examples of how MooTools works. Demos can be opened in <a href="http://jsfiddle.net">jsFiddle</a> for editing, and you can <a href="https://github.com/fakedarren/mootools-demos">download the entire demo runner here</a>.</p>
			
			<p>We hope you enjoy our demos.</p>
			<p>The MooTools Development Team.</p>
		</div>
	</div>
	
</body>
</html>
