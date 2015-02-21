


<!doctype html>
<html>

	<head>
		<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta content="utf-8" http-equiv="encoding">
		<title>WiFindUs</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<script type="text/javascript" src="js/blog.js"></script>
		<script type="text/javascript" src="js/menu.js"></script>
		<script type="text/javascript" src="js/jquery-1.11.2.min.js"></script>
		

		<link rel="stylesheet" href="mobile.css">
		<link rel="stylesheet" href="600.css">
		<link rel="stylesheet" href="685.css">
		<link rel="stylesheet" href="800.css">
		<link rel="stylesheet" href="900.css">
		<link rel="stylesheet" href="blog.css">
		
		
		<link rel="icon"	type="image/png"		href="images/favicon.png">



		<?php
		/////////////////////// META TAGS ///////////////////////

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
								
									foreach ($path as $level) 
									{
										if(strpos($level,'.txt') !== false)
										{
											$txt_file    = file_get_contents($file);
											$rows        = explode("\n", $txt_file);
											array_shift($rows);
											
											$numImages = 0;
											$dropCapDone = false;
											$images = array();
											$showNext = "";

											foreach($rows as $row => $data)
											{
											    $row_data = explode('^^'.'*'.'^^', $data);
											    
											    foreach ($row_data as $item) 
											    {	
											    	if($showNextElement === true)
											    	{
													    if($showNext == "tags")
												    	{
												    		echo "<meta name=\"keywords\" content=\"".$item."\">";
												    		$showNextElement = false;
									    				}
													}
													if (strpos($item,'TAGS') !== false) 
								    				{
											    		$showNextElement = true;
										    			$showNext = "tags";
										    			$numImages = 0;
						   							}
												}
											}
										}		
									}
							}
						}
					} 
		?>



	</head>
	
	
	<body>
	
		<div id="header">
		
			<a href="index.html" id="logo"><img src="images/logo.png" alt="WiFindUs"/></a>
			
			<img id="menu" src="images/menu.png" alt="menu" onclick="toggleMenu('icon')"/>
			
			<nav id="nav">
				<ul>
					<li onclick="goTo('index.html')"><a href="index.html">Home</a></li>
					<li onclick="goTo('services.html')"><a href="services.html">Services</a></li>
					<li onclick="goTo('team.html')"><a href="team.html">Team</a></li>
					<li onclick="toggleMenu('navSelected')"><a href="" id="navSelected">Blog</a></li>
					<li onclick="goTo('#contact'); toggleMenu('contact')"><a href="#contact">Contact</a></li>
				</ul>
			</nav>
			
		</div>
	
	
		<div class="pageTitle">
			<h1>Blog</h1>
			<p>It's a blog</p>
		</div>



<!-- ================================================================================ -->
<!-- ==========================   ARCHIVE SIDEBAR   ================================= -->
<!-- ================================================================================ -->

<div id="blog_archive">

			

<?php
		// ================= MOST RECENT ARTICLE ================= -->
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

<!-- ================================================================================ -->





<div id="show_hide_archive">
	<input id = "archive_display_button" type="image" src="images/hide_archive.png" onclick="toggleArchiveDisplay()">
</div>








<div id = "blog_content">
	
	<br>

	<div id = "scroll">
	

	<div id="wrap">



<!-- ================================================================================= -->
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
							     $post_data = array('post_title' => $level,'count' => $count);
							?>

							<script type="text/javascript">
							    var post_data = <?php echo json_encode($post_data); ?>;
							    addArticleInfo(post_data.post_title, post_data.count);
							</script>


							<?php
						}
					}
				}
			}
			$count++;
		}
								

		?>

		<!-- <script> addArticle(); </script> -->   
<!-- ================================================================================= -->

	</div>

	</div>



	<div id = "blog_break">
		<br>
	</div>

</div>

		<footer id = "footer">
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
			
			<div class="footer_column" id="contact">
				<h2>Contact Us</h2>
				<p>Email: <a href="mailto: business@wifindus.com">business@wifindus.com</a></p>
			</div>
		</footer>

	</body>
	
	
	
</html>