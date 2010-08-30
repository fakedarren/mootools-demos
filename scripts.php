<?
include("packager/packager.php");
header('Content-type: text/javascript');
$packager = new Packager(dirname(__FILE__) . "/core/");
echo $packager->build_from_components(array("Core"));
?>