<?
include(dirname(__FILE__) . "/../packager/packager.php");
header('Content-type: text/javascript');
$packager = new Packager(array(dirname(__FILE__) . "/../core/"));
echo $packager->build_from_files($packager->get_all_files());
?>