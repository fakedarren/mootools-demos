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
		?>
				<li><a href="?demo=<?php echo $folder; ?>"><?php echo $folder; ?></a></li>	
		<?php		
				}
		    }
		    closedir($handle);
		}	
		?>
			</ul>	
		</div>
		<div id="rightcolumn">
			<h2>Getting started using demos</h2>
			<p>The demos are provided here to give users an idea of how MooTools works.  The worst thing you can do is to copy and paste code from the demos without understanding how it works.  Instead, these demos aim to show you live examples of how the framework is used properly so you can understand the code and have fun playing with it. This doesn't mean you cannot copy the demos verbatim, but we will be more inclined to help if we determine that you understand not only how to copy and paste, but also how the demos work. The demos that work here should also work for you, so if they don't, try to solve your problem before asking for one of the developers to fix it for you.</p>
			
			<h2>Demos organization</h2>
			<p>All demos are all organized in the same way. On every demo's page you will find a navigation bar (see image below) and often information about its usage.</p>
			<p>The navigation bar is composed by 4 links: docs references, js code, html code and css code.</p>
			
			<p class="box clear">
				<img src="/assets/images/navbar.gif" alt="[navigation bar]" width="471" height="37"></p>
			
			<ul class="start">
			<li>The <span class="title">docs references</span> provides links to the documentation for all the MooTools functions and Classes the demo is using.</li>
				<li>The <span class="title">js code</span> contains the JavaScript code of the demo.<br><strong>NOTE:</strong> All demos EXCEPT <a href="//DomReadyVS.Load">DomReadyVS.Load</a> are wrapped inside a "domready" which is not included in the <em>js code</em> you see. (You can see it by viewing at page's actual source code). This means the following is the actual content of the page:<br><br><div id="js" class="code">window.addEvent('domready', function() {
			// HERE IS WHAT YOU READ IN JS CODE
			});", 'javascript');
			</div>
					If you are going to reproduce the demo, remember the domready event! (More info about this topic is available <a href="http://docs.mootools.net/Window/Window-DomReady.js#domready">here</a> and <a href="http://clientside.cnet.com/wiki/mootorial/04-window#window.addevent">here</a>).</li>
				<li>The <span class="title">html code</span> is simply the portion of the HTML in the page that is specific to the demo.</li>
				<li>The <span class="title">css code</span> is simply the portion of the page's CSS that is relevant to the demo.</li>
			</ul>
			<p>&nbsp;</p>
			<p><strong>Note:</strong> <span class="title">Why DomReadyVS.Load is different?</span> DomReadyVS.Load attends to show you the difference between MooTools' custom domready event and the native onload event. Having a domready inserted into another domready would not provide the desired result.</p>
			
			<h2>Final notes</h2>
			<p>All of the demos listed here use the latest MooTools release. If you find a bug (and that means something wrong with one of the demos here), please report it in the forum. Also, before asking for any help, do yourself and the developers a favor and try to first understand the code, read the <a href="http://clientside.cnet.com/wiki/mootorial">mootorial</a>, read the <a href="http://docs.mootools.net/">documentation</a> and read <a href="http://blog.mootools.net/2007/6/5/help-i-dont-know-javascript">Michelle's article</a>. If none of this helps, please come ask us in the forums.</p>
			<p>&nbsp;</p>
			<p>We hope you enjoy our demos.</p>
			<p>The MooTools Development Team.</p>
		</div>
	</div>
	
</body>
</html>
