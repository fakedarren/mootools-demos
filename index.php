<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>MooTools Demos</title>
</head>

<body>

	<ul>
<?
if ($handle = opendir('demos')){
    while (false !== ($folder = readdir($handle))){
        if ($folder != "." && $folder != ".."){
?>
		<li><a href="demo.php?demo=<?=$folder;?>"><?=$folder;?></a></li>	
<?		
		}
    }
    closedir($handle);
}	
?>
	</ul>
	
</body>
</html>
