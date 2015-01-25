<!doctype html>
<html>

	<head>
		<title>WiFindUs</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<script type="text/javascript" src="js/blog.js"></script>
		<script type="text/javascript" src="js/menu.js"></script>
		<link rel="stylesheet" href="mobile.css">
		<link rel="stylesheet" href="600.css">
		<link rel="stylesheet" href="900.css">
		<link rel="icon"	type="image/png"		href="images/favicon.png">
	</head>
	
	
	<body>
	
		<div id="header">
		
			<a href="index.html" id="logo"><img src="images/logo.png" alt="WiFindUs"/></a>
			
			<img id="menu" src="images/menu.png" alt="menu" onclick="toggleMenu()"/>
			
			<nav id="nav">
				<ul>
					<li onclick="goTo('index.html')"><a href="index.html">Home</a></li>
					<li onclick="goTo('services.html')"><a href="services.html">Services</a></li>
					<li onclick="goTo('team.html')"><a href="team.html">Team</a></li>
					<li onclick="toggleMenu()"><a href="blog.php" id="navSelected">Blog</a></li>
					<li onclick="goTo('')"><a href="">Contact</a></li>
				</ul>
			</nav>
			
		</div>
	
	
		<div class="pageTitle">
			<h1>Blog</h1>
			<p>It's a blog</p>
		</div>


<div id="blog_archive">

			<?php
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
					   		
					   		return ($date1<$date2)?-1:1;
					}
	
					uksort($files,"sortDate");
					 
 

				 	$count = 0;
					foreach($files as $date=>$title)
					{
						echo "<div id = \"blog_entry_scroll_".$count."\">";
							echo "<div id=\"blog_article_archive\" class=\"blog_article_archive\">";
								echo "<div id=\"blog_article_archive_".$count."\" onclick=\"location.href='http://m-templeton.com/wfu-website/blog.php#blog_entry_".$count."';\">";

								echo "<div id=\"blog_article_info\" class=\"blog_article_info\">";
									$dmyDate = explode("-", $date);
									echo "<h1 class=\"archive_title\">".$title."</h1>";
									echo "<h2 class=\"archive_date\">".$dmyDate[2]."-".$dmyDate[1]."-".$dmyDate[0]."</h2>";
								echo "</div>";	
								
								echo '<script type="text/javascript">addArchive();</script>';

									echo "<div id=\"blog_article_selected_".$count . "\" class=\"blog_article_selected\">";
										
									echo "</div>";

									
								echo "</div>";
							echo "</div>";
						echo "</div>";
						$count++;
					}

				echo "</div>";

			?>


</div>

<div id = "blog_content">
	

	<div id = "blog_break">
		<br>
	</div>


<div id = "scroll">

<?php
	$dir = dirname(__FILE__) . '/blog_posts/*';
	$count = 0;
	$currentImage = 0;
	$display_dates = array();
	$imageCount = 0;

	foreach($files as $date=>$title)
	{
		foreach(glob($dir) as $file) 
		{
			$path = explode("/", $file);
			
			foreach ($path as $level) 
			{
			if(strpos($level,'.txt') !== false)
				{
					$title = explode("_", $level);
					$display_date = explode(".", $title[1]);
					
					if($display_date[0] === $date)
					{
						foreach ($path as $level) 
						{
							if(strpos($level,'.txt') !== false)
							{
								$txt_file    = file_get_contents($file);
								$rows        = explode("\n", $txt_file);
								array_shift($rows);
								
								$numImages = 0;
								
								$images = array();

								foreach($rows as $row => $data)
								{
								    $row_data = explode('^^'.'*'.'^^', $data);
								    
								    foreach ($row_data as $item) 
								    {	
								    	if($showNextElement === true)
								    	{
										    if($showNext == "title")
									    	{
									    		echo "<div id = \"blog_entry_".$count."\">";
									    		echo "<div id = \"blog_title_container\">";
									    			echo "<h1 id= 'blog_article_title'>".$item."</h1>";
									    		echo "</div>";

									    		$showNextElement = false;
									    	}

									    	if($showNext == "date")
									    	{
									    		echo "<div id = \"blog_date_container\">";
									    			echo "<h2 id= 'blog_article_date'>".$item."</h2>";
									    		echo "</div>";

									    		echo "<div id = \"blog_entry\">";
												$count++;
									    		$showNextElement = false;
									    	}

									    	if($showNext == "image")
									    	{
									    		$images[$currentImage] = $item;
												$currentImage++;
									    		$showNextElement = false;
									    	}

									    	if($showNext == "text")
									    	{
									    		if (strpos($item,'^^') === false) 
									    		{
									    			if($dropCapDone === false)
									    			{
														echo "<p class=\"introduction\">".$item[0]."</p>";
										    			$dropCapDone = true;
										    		}
										    		echo "<p class=\"blog_text\">";
										    			$text = substr($item, 1);
										    			echo $text;
										    		echo "</p>";
									    		}
											}
										}

								    	if (strpos($item,'TITLE') !== false) 
								    	{
								    		if($showNext == "image")
									    	{
									    		displayImages($images, $numImages); 
									    	}
								    		$showNextElement = true;
							    			$showNext = "title";
							    			$dropCapDone = false;
							    			$numImages = 0;
						   				}

						   				if (strpos($item,'DATE') !== false) 
								    	{
								    		if($showNext == "image")
									    	{
									    		displayImages($images, $numImages); 
									    	}
								    		$showNextElement = true;
							    			$showNext = "date";
							    			$dropCapDone = false;
							    			$numImages = 0;

						   				}
										
										else if (strpos($item,'TEXT') !== false) 
								    	{
											if($showNext == "image")
									    	{
									    		displayImages($images, $numImages); 
									    	}
							    		 	$showNextElement = true;
								    		$showNext = "text";
								    		$dropCapDone = false;
								    		$numImages = 0;

								    	}

								    	else if (strpos($item,'IMAGE') !== false) 
								    	{
								    		$showNextElement = true;
								    		$showNext = "image";
								    		$dropCapDone = false;
								    		$numImages++;
								    	}

								    	else if (strpos($item,'VIDEO') !== false) 
								    	{
								    		$showNextElement = true;
								    		$showNext = "video";
								    		$dropCapDone = false;
								    		$numImages = 0;

								    	}
									}

								}
								if($showNext == "image")
							    {
							    	displayImages($images, $numImages, true); 
							    }
							echo "</div>";	
							echo "&nbsp";
							echo "</div>";
							}

						}
					}
				}
			}
		}
	}

	echo "<div id = \"blog_entry_".$count."\">";
	echo "</div>";


function displayImages($images, $numImages) 
{
	global $imageCount;
	for($i = 0; $i<$numImages; $i++)
	{
		if($numImages < 3)
		{
			echo "<a href=\"#slideshow_image_".$imageCount."\">";
				echo "<img id = \"full_size_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
			echo "</a>";

			echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
				echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";

				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;

				echo "<div id='imageContainer'>"; 
				   	
				   	echo " <div id='prevBtnContainer'>";
						echo "<a href=\"#slideshow_image_".$prevImage."\">";
							echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
						echo "</a>";   
					echo "</div>";
				   
					echo " <div id='nextBtnContainer'>";
						echo "<a href=\"#slideshow_image_".$nextImage."\">";
							echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
						echo "</a>";    
					echo "</div>";

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
				echo "</div>";

				echo "</div>";

				$imageCount++;		
		}
		else if($numImages === 3)
		{
			if($i === 0)
			{
				echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<img id = \"full_size_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
				echo "</a>";

				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
					
					$nextImage = $imageCount+1;
					$prevImage = $imageCount-1;

					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";	

				$imageCount++;
			}
			else
			{
				if($i === 1)
				{
					echo "<a href=\"#slideshow_image_".$imageCount."\">";
						echo "<div id = \"half_thumbnail_container_first\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
					
					echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
						echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
						
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;

						echo "<div id='imageContainer'>"; 
						   	echo " <div id='prevBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$prevImage."\">";
									echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
								echo "</a>";   
							echo "</div>";
						   
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$nextImage."\">";
									echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
								echo "</a>";    
							echo "</div>";

						    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";

					echo "</div>";

					$imageCount++;
				}
				if($i === 2)
				{
					echo "<a href=\"#slideshow_image_".$imageCount."\">";
						echo "<div id = \"half_thumbnail_container\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
					
					echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
						echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
						
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;

						echo "<div id='imageContainer'>"; 
						   	echo " <div id='prevBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$prevImage."\">";
									echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
								echo "</a>";   
							echo "</div>";
						   
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$nextImage."\">";
									echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
								echo "</a>";    
							echo "</div>";

						    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";
					echo "</div>";

					$imageCount++;
				}
			}
		}
		else if($numImages === 4)
		{
			if($i === 0)
			{
			echo "<a href=\"#slideshow_image_".$imageCount."\">";
				echo "<img id = \"full_size_image_thirds\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
			echo "</a>";

			echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
				echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";		
				
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;

				echo "<div id='imageContainer'>"; 
				   	echo " <div id='prevBtnContainer'>";
						echo "<a href=\"#slideshow_image_".$prevImage."\">";
							echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
						echo "</a>";   
					echo "</div>";
				   
					echo " <div id='nextBtnContainer'>";
						echo "<a href=\"#slideshow_image_".$nextImage."\">";
							echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
						echo "</a>";    
					echo "</div>";

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
				echo "</div>";
			echo "</div>";

			$imageCount++;	
			}			
			else if($i < 3)
			{
				echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<div id = \"third_thumbnail_container\">";
					echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";				
				echo "</a>";
					
				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
					
					$nextImage = $imageCount+1;
					$prevImage = $imageCount-1;
			
					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";

				$imageCount++;
			}
			else if($i === 3)
			{
				echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<div id = \"third_thumbnail_container_last\">";
					echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";				
				echo "</a>";
					
				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
						
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;
						
						echo "<div id='imageContainer'>"; 
						   	echo " <div id='prevBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$prevImage."\">";
									echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
								echo "</a>";   
							echo "</div>";
						   
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#slideshow_image_".$nextImage."\">";
									echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
								echo "</a>";    
							echo "</div>";

						    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";
				echo "</div>";

				$imageCount++;
			}
		}
		else if($numImages > 4)
		{
			$num_unshown_images = $numImages - 4;
			if($i === 0)
			{
				echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<img id = \"full_size_image_thirds\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
				echo "</a>";

				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
						echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
						
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;

										
					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";

				$imageCount++;			
			}
			else if($i < 3)
			{
					echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<div id = \"third_thumbnail_container\">";
					echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";				
				echo "</a>";
					
				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
					
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;

										
					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";

				$imageCount++;
			}
			else if($i === 3)
			{
				echo "<a href=\"#slideshow_image_".$imageCount."\">";
					echo "<div id = \"third_thumbnail_container_last\">";
					echo "<h3 id = \"more_images\"> +". $num_unshown_images ." more </h3>";

					echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";				
				echo "</a>";
					
				echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
					
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;

					
					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";

				$imageCount++;
			}
			else if($i > 3)
			{
					echo "<div id=\"slideshow_image_".$imageCount."\" class=\"modalDialog\">";
					echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";
					
					$nextImage = $imageCount+1;
					$prevImage = $imageCount-1;

						
					echo "<div id='imageContainer'>"; 
					   	echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$prevImage."\">";
								echo "<input id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"prevSlide()\" onclick=\"#slideshow_image_".$nextImage."\">	";
							echo "</a>";   
						echo "</div>";
					   
						echo " <div id='nextBtnContainer'>";
							echo "<a href=\"#slideshow_image_".$nextImage."\">";
								echo "<input id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" ontouchstart=\"nextSlide()\" onclick=\"nextSlide()\">";
							echo "</a>";    
						echo "</div>";

					    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</div>";
				echo "</div>";
				
				$imageCount++;
			}
		}
	}
}


?>
</div>

	<div id = "blog_break">
		<br>
	</div>

</div>

		<footer>
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