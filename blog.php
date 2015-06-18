<!doctype html>
<html>

	<head>
		<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta content="utf-8" http-equiv="encoding">
		<title>WiFindUs - Blog</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<script type="text/javascript" src="js/blog-old.js"></script>
		<script type="text/javascript" src="js/menu.js"></script>	
		<link rel="stylesheet" href="css/main.min.css">
		<link rel="stylesheet" href="css/blog-old.css">
		<link rel="icon"	type="image/png"		href="images/favicon.png">
	</head>
	
	
	<body>
	
		<div id="header">
			
			<a href="index.html" id="logo"><img src="images/logo.png" alt="WiFindUs"/></a>
			<img id="menu" src="images/menu.png" alt="menu" onclick="toggleMenu('icon')"/>
			
			<nav id="nav">
				<ul>
					<li onclick="goTo('index.html')"><a href="index.html">Home</a></li>
					<li onclick="goTo('technology.html')"><a href="technology.html">Technology</a></li>
					<li onclick="goTo('team.html')"><a href="team.html">Team</a></li>
					<li onclick="toggleMenu('navSelected')"><a href="" id="navSelected">Blog</a></li>
					<li onclick="showHideFooter(); toggleMenu('contact')">Contact</li>
				</ul>
			</nav>
			
		</div>

		<div class="pageTitle" id = "pageTitle">
			<div class="centreVertical">
				<h1>BLOG</h1>
				<p>Keep up to date with WiFindUs</p>
			</div>
		</div>


<!-- ==========================   ARCHIVE SIDEBAR   ================================= -->
<div id="blog_archive" style="left:40px;">

<?php
		// MOST RECENT ARTICLE
		$dir = dirname(__FILE__) . '/blog_posts/*';
		$files = array();
		$dates = array();
		
		foreach(glob($dir) as $file) 
		{
			$path = explode("/", $file);
			foreach ($path as $level) 
			{
				if(strpos($level,'.txt') !== false)
				{
					$title = explode("_", $level);
					$date = explode(".", $title[1]);
					$files[$date[0]] = $title[0];
				}
			}
		}

		function sortDate($date1,$date2)
		{					
			if ($date1 == $date2) 
				return 0;
					   		
				return ($date1>$date2)?-1:1;
		}


		uksort($files,"sortDate");
					 
		foreach($files as $date=>$title)
		{	
			echo "<div id=\"archive_most_recent\">";
					echo "<h1 id=\"most_recent_title\">Most Recent</h1>";

						echo "<div id=\"most_recent_info\" class=\"blog_article_info\" onclick=\"goToPost(0)\">";
							$dmyDate = explode("-", $date);
								echo "<h1 class=\"archive_title\">".$title."</h1>";
								echo "<h2 class=\"archive_date\">".$dmyDate[2]."-".$dmyDate[1]."-".$dmyDate[0]."</h2>";
						echo "</div>";	
			echo "</div>";
			break;
		}
	?>
</div>



<div id="show_hide_archive">
	<input id = "archive_display_button" type="image" src="images/show_hide_archive.png" onclick="toggleArchiveDisplay()">
</div>

<!-- ==========================   MAIN CONTENT(POSTS)   ================================= -->
<div id = "blog_content">
	<br>
		<div id="wrap">

			<?php
			$count = 0;
			foreach($files as $date=>$title)
			{
				
				foreach(glob($dir) as $file) 
				{
					$path = explode("/", $file);
					
					//EACH PART OF FILE PATH
					foreach ($path as $level) 
					{
						// BLOG POST FILE (any .txt file)
						if(strpos($level,'.txt') !== false)
						{
							$title = explode("_", $level);
							$display_date = explode(".", $title[1]);
							
							// DISPLAY IN CHRONOLOGICAL ORDER BASED ON DATE
							if($display_date[0] === $date)
							{
								// PASS INFO TO JS TO USE WHEN CREATING THE POST
								echo "<script type=\"text/javascript\">";
								  echo "addArticleInfo(\"".$level."\",".$count.")";
								  // echo "addArticleInfo(\"Post 10_2013-12-11.txt\",".$count.")";
								echo "</script>";
							}
						}
					}
				}
				$count++;
			}				
		?>
	<!-- ================================================================================= -->

		</div>

		<noscript>
			You will need Javascript enabled to view this blog. Sorry about that.
		</noscript>



	<div id = "loading">
		<h3>Loading...</h3> 
	</div>


	<div id = "blog_break">
		<br>
	</div>

</div>


		<footer id = "blog_footer" style="bottom:-220px;" >
			<!--
			<div class="footer_column" id="about">
				<h2>About Us</h2>
				<p>WiFindUs is made up of a young and passionate team of engineers, software developers and business professionals that seek to bring innovation to the festival industry.</p>
			</div>
			
			<div class="footer_column" id="friends">
				<h2>Friends</h2>
				<a href="http://www.servalproject.org" ><img src="images/serval_logo.png" alt="Serval"/></a>
				<a href="http://www.flinders.edu.au" ><img src="images/flinders_logo.png" alt="Flinders University"/></a>
				<a href="http://www.air-stream.org.au/" ><img src="images/air-stream_logo.png" alt="Air-Stream Wireless"/></a>
			</div>
		-->
			
			<div class="footer_column" id="contact">
				<h2>Contact Us</h2>
				<p>Email: <a href="mailto: business@wifindus.com">business@wifindus.com</a></p>
			</div>
		</footer>
	

	</body>
	
	
	
</html>