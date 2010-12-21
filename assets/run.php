<?php
$path = dirname(__FILE__) . '/../demos/' . $_GET['demo'] . '/';
$html = file_get_contents($path . 'demo.html');
$css = file_get_contents($path . 'demo.css');
$js = file_get_contents($path . 'demo.js');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>MooTools Demos</title>
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	<style type="text/css">
<?php echo $css; ?>
	</style>
</head>

<body>
	<?php echo $html; ?>
	<script src="../Source/mootools-core-1.3-full.js" type="text/javascript"></script>
	<script src="../Source/mootools-more-1.3-full.js" type="text/javascript"></script>
	<script src="../Source/mootools-art-0.87.js" type="text/javascript"></script>
	<script type="text/javascript">
		<?php echo $js; ?>
	</script>
</body>
</html>
