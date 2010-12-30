<?php

$delay = (isset($_GET['delay'])) ? (int) $_GET['delay'] : ((isset($_POST['delay'])) ? (int) $_POST['delay'] : 1);
sleep($delay);


if (!empty($_GET['html'])){
	$output = $_GET['html'];
} elseif (!empty($_POST['html'])){
	$output = $_POST['html'];
} elseif (!empty($_POST['json'])){
	$output = stripslashes($_POST['json']);
} elseif (!empty($_GET['jsonp'])){

	header('Content-Type: text/javascript');
	$callback = !empty($_GET['callback']) ? $_GET['callback'] : 'callback';
	$output = $callback . '({"some": "jsonp", "data": "data"});';

} else {
	$output = 'html';
}

header("Cache-Control: no-cache");
header("Pragma: no-cache");

echo $output;
