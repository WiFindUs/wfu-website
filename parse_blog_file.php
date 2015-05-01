<?php 

$articleNum = $_POST['articleNum'];
$articleTitle = $_POST['articleTitle'];

$dir = dirname(__FILE__) . '/blog_posts/*';
$count = $articleNum; 
$currentImage = 0;
$display_dates = array();
$imageCount = 0;  

$txt_file    = file_get_contents('blog_posts/'.$articleTitle);
$rows        = explode("\n", $txt_file);
array_shift($rows);
								
$numImages = 0;
$dropCapDone = false;
$images = array(); //Stores paths to images 
$im_descriptions = array(); //Image descriptions
$showNext = ""; //Type of element to be shown next

$handleImageDescription = false;
$showNextElement = false;

	foreach($rows as $row => $data)
	{
		$row_data = explode('^^'.'*'.'^^', $data);
								    
		foreach ($row_data as $item) 
		{	
			if($handleImageDescription === true)
			{
				$adjustedCount = $count-1;
				$adjustedCurrentImage = $currentImage-1;
				$descriptionIdentifier = $adjustedCount."_".$adjustedCurrentImage;
				$im_descriptions[$descriptionIdentifier] = $item;
				$handleImageDescription = false;
			}
			if($showNextElement === true)
			{
				if($showNext == "title")
				{
					echo "<div id = \"blog_entry_".$count."\">";
						echo "<div id = \"".$item. "\"class = \"newData\">";
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

							echo "<p class=\"blog_text\">";
									$text = substr($item, 1);
									echo $text;
							echo "</p>";
						}
						else
						{
							echo "<p class=\"blog_text\">";
								$text = substr($item, 0);
								echo $text;
							echo "</p>";
						}
					}
				}

				if($showNext == "video")
				{
					echo $item;
					$showNextElement = false;
				}
			}

			// DETERMINE ITEMS TO DISPLAY BASED ON TAGS
			if (strpos($item,'TITLE') !== false) 
			{
				if($showNext == "image")
				{
					displayImages($images, $numImages); 
				}
				$showNextElement = true;
				$showNext = "title";
				$numImages = 0;
			}
			else if (strpos($item,'DATE') !== false) 
			{
				if($showNext == "image")
				{
					displayImages($images, $numImages); 
				}
				$showNextElement = true;
				$showNext = "date";
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
				$numImages = 0;
			}
			else if (strpos($item,'IMAGE') !== false) 
			{
				$showNextElement = true;
				$showNext = "image";
				$numImages++;
			}
			else if (strpos($item,'VIDEO') !== false) 
			{
				if($showNext == "image")
				{
					displayImages($images, $numImages); 
				}
				$showNextElement = true;
				$showNext = "video";
				$numImages = 0;
			}

			if (strpos($item,'IM_DESCRIPTION') !== false) 
			{
				$handleImageDescription = true;
			}
								
		}
	}
	if($showNext == "image")
	{
		displayImages($images, $numImages, true); 
	}
			echo "</div>";	
		echo "</div>";
	echo "</div>";

	echo "<div id = \"blog_entry_".$count."\">";
	echo "</div>";




function displayImages($images, $numImages) 
{	
	echo "&nbsp";
	global $imageCount;
	global $articleNum;
	global $im_descriptions;
	for($i = 0; $i<$numImages; $i++)
	{
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////// LESS THAN 3 IMAGES //////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		if($numImages < 3)
		{
			echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
				echo "<img id = \"full_size_image\" src=\"blog_posts/".$images[$imageCount]."\"   alt=\"Image\">";
			echo "</a>";

					echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
						
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;

							echo "<div id='imageContainer'>"; 
								if($imageCount == 0)//no prev image
								{
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}
								else //prev image
								{
									echo " <div id='prevBtnContainer'>";
										echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
											echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
										echo "</a>";   
									echo "</div>";
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}

									$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}
				    			echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" >";
							echo "</div>";

						echo "</div>";


						


				$imageCount++;		
		}


		
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////// 3 IMAGES ///////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		else if($numImages === 3)
		{
			///////// FIRST IMAGE /////////
			if($i === 0)
			{
				list($width, $height, $type, $attr) = getimagesize("blog_posts/".$images[$imageCount]);

				// PORTRAIT //
				if($width < $height)
				{
					echo "<div id = \"vertical_image_container\">";
						
					echo "<div id = \"fullsize_vertical_image_container\">";
						echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
							echo "<img id = \"vertical_image_fullsize\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</a>";
					echo "</div>";
			
	
						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;

							echo "<div id='imageContainer'>"; 
								if($imageCount == 0)//no prev image
								{
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}
								else //prev image
								{
									echo " <div id='prevBtnContainer'>";
										echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
											echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
										echo "</a>";   
									echo "</div>";
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}
							
								$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    			echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";

				   



							echo "</div>";

						echo "</div>"; 
						


						$imageCount++;		
				}

				// LANDSCAPE //
				else
				{
				echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
					echo "<img id = \"full_size_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
				echo "</a>";
	
	
						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
						$nextImage = $imageCount+1;
						$prevImage = $imageCount-1;

							echo "<div id='imageContainer'>"; 
								if($imageCount == 0)//no prev image
								{
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}
								else //prev image
								{
									echo " <div id='prevBtnContainer'>";
										echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
											echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
										echo "</a>";   
									echo "</div>";
									if($imageCount+1 == $numImages) //no next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
									else // is a next image
									{
										echo " <div id='nextBtnContainer'>";
											echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
												echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
											echo "</a>";
											echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
										echo "</div>";
									}
								}
									$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    			echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
							echo "</div>";
						echo "</div>";

				$imageCount++;
				}

			}
			else
			{
				// PORTRAIT //
				if($width < $height)
				{
					if($i === 1)
					{
						echo "<div id = \"vertical_image_thumbnails\">";
							
							echo "<div id = \"vertical_image_thumbnail_container\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_half\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}
				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

					$imageCount++;
					}
					if($i === 2)
					{
						echo "<div id = \"vertical_image_thumbnail_container\">";

							echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
								echo "<img id = \"vertical_thumbnail_half\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
							echo "</a>";
						echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
					$imageCount++;
						
						echo "</div>";
						echo "</div>";
					}

				}

				// LANDSCAPE //
				else
				{

				if($i === 1)
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<div id = \"half_thumbnail_container_first\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
					
	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
					$imageCount++;
				}
				if($i === 2)
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<div id = \"half_thumbnail_container\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
					
	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

					$imageCount++;
				}
			}
			}
		}







		////////////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////// 4 IMAGES ///////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		else if($numImages === 4)
		{
			///////// FIRST IMAGE /////////
			if($i === 0)
			{
				list($width, $height, $type, $attr) = getimagesize("blog_posts/".$images[$imageCount]);

				// PORTRAIT //
				if($width < $height) 
				{
					echo "<div id = \"vertical_image_container\">";
						
					echo "<div id = \"fullsize_vertical_image_container\">";
						echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
							echo "<img id = \"vertical_image_fullsize\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</a>";
					echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

				$imageCount++;		
				}

				// LANDSCAPE //
				else
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<img id = \"full_size_image_thirds\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</a>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;	
				}	
			}
			else
			{
				// PORTRAIT //
				if($width < $height)
				{
					///////// SECOND IMAGE /////////		
					if($i === 1)
					{
						echo "<div id = \"vertical_image_thumbnails\">";
							
							echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;
					}

					///////// THIRD IMAGE /////////		
					if($i === 2)
					{
						echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;
					}

					///////// FOURTH IMAGE /////////
					else if($i === 3)
					{
						echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;

						echo "</div>";
					}
				
				}
				else
				{

				///////// SECOND AND THIRD IMAGE /////////		
				if($i < 3)
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<div id = \"third_thumbnail_container\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
						
	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}


						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;
				}

				///////// FOURTH IMAGE /////////
				else if($i === 3)
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<div id = \"third_thumbnail_container_last\">";
						echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
						echo "</div>";				
					echo "</a>";
						
	

			echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";


					$imageCount++;
				}																						
		}
	}
}







		/////////////////////////////////////////////// MORE THAN 4 IMAGES ///////////////////////////////////////////////
		else if($numImages > 4)
		{
			$num_unshown_images = $numImages - 4;
			
			///////// FIRST IMAGE /////////
			if($i === 0)
			{
				list($width, $height, $type, $attr) = getimagesize("blog_posts/".$images[$imageCount]);

				// PORTRAIT //
				if($width < $height) 
				{
					echo "<div id = \"vertical_image_container\">";	
						echo "<div id = \"fullsize_vertical_image_container\">";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
								echo "<img id = \"vertical_image_fullsize\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
							echo "</a>";
						echo "</div>";

						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
				$imageCount++;		
				}

				// LANDSCAPE //
				else
				{
					echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
						echo "<img id = \"full_size_image_thirds\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
					echo "</a>";

						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

					$imageCount++;	
				}
			}
			else
			{
			
				// PORTRAIT //
				if($width < $height)
				{
					///////// SECOND IMAGE /////////		
					if($i === 1)
					{
						echo "<div id = \"vertical_image_thumbnails\">";
							
							echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

											echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

					$imageCount++;
					}

					///////// THIRD IMAGE /////////		
					else if($i === 2)
					{
						echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
									echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";		
								echo "</a>";
							echo "</div>";

										echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
					$imageCount++;
					}

					///////// FOURTH IMAGE /////////
					else if($i === 3)
					{
						echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
							echo "<div id = \"vertical_image_thumbnail_container_thirds\">";
							echo "<h3 id = \"more_images\"> +". $num_unshown_images ." more </h3>";

							echo "<img id = \"vertical_thumbnail_third\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
							echo "</div>";				
						echo "</a>";

						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

						$imageCount++;
					}
					///////// ALL HIDDEN IMAGES /////////
					else if($i > 3)
					{
								echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
						
						$imageCount++;
						
						if($i - 4 === $num_unshown_images-1)
						{
							echo "</div>";
							echo "</div>";
							//echo "</div>";
						}
					}
				}


				// LANDSCAPE //
				else
				{
					///////// SECOND AND THIRD IMAGE /////////		
					if($i < 3)
					{
						echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
							echo "<div id = \"third_thumbnail_container\">";
							echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
							echo "</div>";				
						echo "</a>";
							
						echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

						$imageCount++;
					}

					///////// FOURTH IMAGE /////////
					else if($i === 3)
					{
						echo "<a href=\"#".$articleNum."_fullsize_image_".$imageCount."\">";
							echo "<div id = \"third_thumbnail_container_last\">";
							echo "<h3 id = \"more_images\"> +". $num_unshown_images ." more </h3>";

							echo "<img id = \"thumbnail_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\">";
							echo "</div>";				
						echo "</a>";
							
	echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";

						$imageCount++;
					}	

					///////// ALL HIDDEN IMAGES /////////
					else if($i > 3)
					{
								echo "<div id=\"".$articleNum."_fullsize_image_".$imageCount."\" class=\"modalDialog\" >";
				$nextImage = $imageCount+1;
				$prevImage = $imageCount-1;


				echo "<div id='imageContainer'>"; 
				  

					if($imageCount == 0)//no prev image
					{
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
					echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}
					else //prev image
					{
						echo " <div id='prevBtnContainer'>";
							echo "<a href=\"#".$articleNum."_fullsize_image_".$prevImage."\">";
								echo "<img id=\"prevImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >	";
							echo "</a>";   
						echo "</div>";
						if($imageCount+1 == $numImages) //no next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
						else // is a next image
						{
							echo " <div id='nextBtnContainer'>";
								echo "<a href=\"#".$articleNum."_fullsize_image_".$nextImage."\">";
									echo "<img id=\"nextImageBtn\" type=\"image\" src=\"images/next_image_arrow.png\" >";
								echo "</a>";
								echo "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>";     
							echo "</div>";
						}
					}

						$imDescriptionID = $articleNum."_".$imageCount;
								if($im_descriptions[$imDescriptionID] != null)
								{								
									echo " <div id='imageDescriptionContainer'>";
										echo "<p id = \"imageDescription\">".$im_descriptions[$imDescriptionID]."</p>";
									echo "</div>";
								}

				    echo " <img id = \"blog_slideshow_image\" src=\"blog_posts/".$images[$imageCount]."\" alt=\"Image\" onclick=\"location.href=\"#".$articleNum."_fullsize_image_".$nextImage.";\">";
				echo "</div>";

				echo "</div>";
						
						$imageCount++;
					}										
				}
			}
		}
	}
	echo "&nbsp";
}








/*
	echo "<html>";

		echo "<head>";
			echo "<meta charset=\"UTF-8\">";
			echo "<meta name=\"dekeywordsscription\" content=\"Free Web tutorials\">";
			echo "<meta name=\"\" content=\"HTML,CSS,XML,JavaScript\">";
			echo "<meta name=\"author\" content=\"Hege Refsnes\">";
		echo "</head> ";

		echo "<div id = \"".$articleIdentifier."\" class = \"newData\">";
			echo "<div id = \"soundwave\" class = \"newData\">";
				echo "<h1> SOUNDWAVE</h2>";
				echo 'Thank you '. $count . ' ' . $_POST['lastname'] . ', says the PHP file';  
			echo "</div>";
		echo "</div>";

	echo "</html>";

*/





?>