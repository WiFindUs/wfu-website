<?php

		$articleStart = $_POST['articleNum'];


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
					 
		$count = 0;
		//===================================================================================
		// GENERATE ARCHIVE
		//===================================================================================
		foreach($files as $date=>$title)
		{	
			if($count >= $articleStart /*&& $count < 10*/)
			{

				//_".$count."
		echo "<div class = \"blog_entry_scroll\" id = \"blog_entry_scroll_".$count."\">";

							echo "<div id=\"blog_article_archive\" class=\"blog_article_archive_".$count."\">";

				
					

						echo "<div id=\"blog_article_archive_".$count."\" onclick=\"goToPost(". $count .")\";>"; 			
							echo "<div id=\"blog_article_info\" class=\"blog_article_info\">";
								$dmyDate = explode("-", $date);
									echo "<h1 class=\"archive_title\">".$title."</h1>";
									echo "<h2 class=\"archive_date\">".$dmyDate[2]."-".$dmyDate[1]."-".$dmyDate[0]."</h2>";
							echo "</div>";	

							echo "<div id=\"blog_article_selected_".$count . "\" class=\"blog_article_selected\">";
							echo "</div>";
					echo "</div>";
				echo "</div>";
			echo "</div>";
			}
			$count++;
		}
		//===================================================================================
		// END
		//===================================================================================
	
			
	?>