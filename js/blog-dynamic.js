 var postsCounter = 0;
 var firstPostLoaded = false;
 var postData = [];
 var $window = $(window);
 var $blogContent;
 var $sidebar;
 var sidebarList = [];
 var $firstPost;
 var loadOnDemand = false;
 
 var postsToAppend = [];
 var difference = 0;
 
 $window.load(getPostsList);
/* $window.scroll(handleScroll);*/
 
 var currentArticle = 0;
 
 
 /*==== GET DATA & HTML ELEMENTS & ADD EVENT LISTENERS====*/
 
 // populate #posts-list
 function getPostsList()
 {
	$.ajax({
			url: "blog-archive/archive.xml",
			cache: false,
			dataType: "xml",
			success: function(xml){parsePostsList(xml);} //get and resize images
		});
 }
 
 function parsePostsList(xml)
 {
	 $(xml).find('post').each(function(){
		 var $post = $(this);
		 var postTitle = $post.find("title").text();
		 var postDate = $post.find("date").text();
		 
		 var postMonth = $post.parent().attr('value');
		 var postYear = $post.parent().parent().attr('value'); //get it before find('post')
		 
		 var dashedTitle = postTitle.replace(/ /g , "-");
		 var postPath = "blog-archive/"+postYear+"/"+postMonth+"/"+dashedTitle+".html";
		 
		 postData.push({title:postTitle, date:postDate, month:postMonth, year:postYear, path:postPath});
		 
	});
	
	postData.reverse();
	
	//if(!window.location.hash)
	//{
		requestPost(postData[0].path, postData[0].title, 0); //may not always be needed
	//}
	populateSidebar();
	getSidebarList();
	populateArchive();
	getArchiveList();
 }
 
 
 
 function requestPost(filePath, title, index)
 {
	 console.log("PERMISSION TO RETRIEVE: "+ title);
	 
	 $.ajax({
			url: filePath,
			cache: false,
			success: function(post){
				console.log("SUCCESSFULLY RETREIVED: "+ title + " index: " + index);
				
				if(difference > 0)
				{
					//console.log("Difference: " + difference);
					postsToAppend[index] = post;
					if(difference ==1)
					{
						appendPost(postsToAppend, title); //assign to array until complete then append + get correct title
						//empty array
						postsToAppend.length = 0;
					}
					difference--;
				}
				else
				{
					//console.log("Append Difference: " + difference);
					appendPost(post, title); //assign to array until complete then append + get correct title
				}
				
				
				if(!firstPostLoaded)
				{
					firstPostLoaded=true;
					$firstPost = $(".blog-post:first");
					$blogContent = $("#blog-content");
					$sidebar = $("#blog-sidebar");
					$window.scroll(handleScroll);
				}
			} //get and resize images
		});
			
 }
 
 
 function populateSidebar()
 {
	 var $postsList = $("#posts-list");
	 for(i=0; i<postData.length; i++)
	 {
		 var hashTitle = postData[i].title.replace(/ /g , "_");
		 var date = postData[i].date + " " + postData[i].month + " " + postData[i].year;
		 
		 var postInfoHTML = "<a href=\"#"+hashTitle+"\" class=\"list-post-info\">"
										+"<div class=\"prog-bar\"></div>"
											+"<div class=\"center-vertical\">"
											
												+"<div class=\"list-post-title\">"+postData[i].title+"</div>"
												+"<div class=\"list-post-date\">"+date+"</div>"
											
											+"</div>"
									+"</a>";
									
									
		$postsList.append(postInfoHTML); //save to an array, then save to a string then append the string (performance)
	 }
	 
 }
 
 function populateArchive()
 {
	 var archiveList = document.getElementById("archive-list");
	 var htmlString = "";
	 
	 var closeYearHTML = "</ul>";
	 var closeMonthHTML = "</li></ul>";
	 
	 for(i=0; i<postData.length; i++)
	 {
		 
		 
		 var yearHTML = "<ul class=\"year\">"
									+"<lh class=\"expanded\">"+postData[i].year+"</lh>";
						
		var monthHTML = "<li>"
									+"<ul class=\"month\">"
											+"<lh class=\"collapsed\">"+postData[i].month+"</lh>";
											
		var postHTML = "<li><a href=\"#"+hashTitle(postData[i].title)+"\" class=\"archive-post-title\">"+postData[i].title+"</a></li>";
		
		 
		 if(i==0)
		{
			//console.log("open first year");
			htmlString = htmlString + "" + yearHTML + "" + monthHTML + "" + postHTML;
		}
		
		 else if(postData[i].year != postData[i-1].year)
		 {
			// console.log("open ANOTHER year");
			 htmlString = htmlString + "" + closeMonthHTML + "" + closeYearHTML + "" + yearHTML + "" + monthHTML + "" + postHTML;
		 }
		 
		else if(i!=0 && postData[i].year == postData[i-1].year)
		{
			if(postData[i].month == postData[i-1].month)
			{
				//console.log("SAME month");
				htmlString = htmlString + "" + postHTML;
			}
			else
			{
				//console.log("CLOSE month & OPEN NEW ONE");
				htmlString = htmlString + "" + closeMonthHTML + "" + monthHTML + "" + postHTML;
			}
		}
		
		if((i+1) == postData.length)
		{
			//console.log("CLOSE EVERYTHING");
			htmlString = htmlString + "" + closeMonthHTML + "" + closeYearHTML ;
		}
		
	 }
	 
	 archiveList.innerHTML = htmlString;
	 
	 
	 
	 /*<ul class="year">
		<lh class="expanded">2015</lh>
			<li>
				<ul class="month">
				<lh class="collapsed">March</lh>
					<li><a href="#" class="archive-post-title">Post Title 1</a></li>
					<li><a href="#" class="archive-post-title">Post Title 2</a></li>
					<li><a href="#" class="archive-post-title">Post Title 3</a></li>
				</ul>
			</li>
			<li>
				<ul class="month">
				<lh class="collapsed">April</lh>
					<li><a href="#" class="archive-post-title">Post Title A</a></li>
					<li><a href="#" class="archive-post-title">Post Title B</a></li>
					<li><a href="#" class="archive-post-title">Post Title C</a></li>
				</ul>
			</li>
	</ul>*/
	 
	 
 }
 
 
 function getSidebarList()
 {
	 sidebarList = document.getElementsByClassName('list-post-info');
	 for(i=0; i < sidebarList.length; i++)
	 {
		 sidebarList[i].addEventListener('click', findIndex);
		 sidebarList[i].postIndex = i;
		 //sidebarList[i].hashTitle = hashTitle(postData[i].title);
	 }
	 
	 
	 archiveTab = document.getElementById("archive");
	 recentTab = document.getElementById("recent");
	 archiveTab.addEventListener('click', toggleTab);
	 recentTab.addEventListener('click', toggleTab);
	 
	 
	 
	 
	 checkHash();
 }
 
 
 
 function getArchiveList()
 {
	 var archiveList = document.getElementById("archive-list");
	 var years = archiveList.getElementsByClassName("year");
	 var months = archiveList.getElementsByClassName("month");
	 var posts = archiveList.getElementsByTagName("a");
	 
	 for(i=0; i < years.length; i++)
	 {
		 years[i].getElementsByTagName("lh")[0].addEventListener('click', expandArchive);
	 }
	 
	 for(i=0; i < months.length; i++)
	 {
		 months[i].getElementsByTagName("lh")[0].addEventListener('click', expandArchive);
	 }
	 
	 for(i=0; i < posts.length; i++)
	 {
		 posts[i].addEventListener('click', findIndex);
		 posts[i].postIndex = i;
	 }
	 
 }
 
 
 function expandArchive(evt)
 {
	 
	 var lh = evt.target; //lh <lh>: either year or month
	 var ul = lh.parentElement; //the list <ul> that contains lh
	 var li = ul.getElementsByTagName("li");
	 
	 
	 if(lh.classList.contains("collapsed"))
	 {
		 lh.classList.remove("collapsed");
		 lh.classList.add("expanded");
		 
		for(var i=0; i<li.length; i++)
		{
			if(li[i].parentElement == ul)
			{
				li[i].style.display = "list-item";
				
				if(li[i].getElementsByTagName("ul")[0]) //if <li> contains a nested <ul> (only true when expanding year)
				{
					//get month
					var nestedLh = li[i].getElementsByTagName("ul")[0].getElementsByTagName("lh")[0];
					
					nestedLh.classList.remove("expanded");
					nestedLh.classList.add("collapsed");
				}
			}
		}
		 
	 }
	 else if(lh.classList.contains("expanded"))
	 {
		 console.log("COLLAPSE");
		 lh.classList.remove("expanded");
		 lh.classList.add("collapsed");
		 
		 for(var i=0; i<li.length; i++)
		 {
			 li[i].style.display = "none";
		 }
		 
	 }
 }
 
 function toggleTab(evt)
 {
	 var tab = evt.target;
	 var postsList = document.getElementById("posts-list");
	 var archiveList = document.getElementById("archive-list");
	 
	 if(!tab.classList.contains("selected"))
	 {
		 if(tab == archiveTab)
		 {
			 archiveTab.classList.add("selected");
			 recentTab.classList.remove("selected");
			 
			 postsList.style.display = "none";
			 archiveList.style.display = "block";
			 
		 }
		 else if(tab == recentTab)
		 {
			 recentTab.classList.add("selected");
			 archiveTab.classList.remove("selected");
			 
			 archiveList.style.display = "none";
			 postsList.style.display = "block";
		 }
		 
	 }
 }
 
 /*====================*/
 
 
 
 /*==== POSTS ====*/
 
 //called when requestPost is successful 
 function appendPost(posts, title)
 {
	 var postsNum = $("#blog-content").children().length;
	 var postsString = "";
	 
	 if(posts.length > 1) //posts is an array
	 { 
		for(var i=0; i<posts.length; i++)
		 {
			 postsString = postsString + posts[i];
		 }
	 }
	 else //posts is a string
	 {
		 postsString = posts;
	 }
	 
	 
	 $("#blog-content").append(postsString);
	 
	 console.log("APPEND: "+ title);
	 
	 if(loadOnDemand)
	 {
		 window.location.hash = "";
		 window.location.hash = hashTitle(title);
		 loadOnDemand = false;
	 }
	 
	 var DOMcheckInterval = setInterval(function(){
		 if(postsNum < $("#blog-content").children().length)
		 {
			 getImages();
			 clearInterval(DOMcheckInterval);
			 console.log("clear interval: " + title);
		 }
	 }, 1000);
 }
 
 
 
 function goToPost(postIndex)
 {
	 if(postsCounter < postIndex)
	 {
		 loadOnDemand = true;
		 
		 difference = postIndex - postsCounter;
		 console.log("post counter: " + postsCounter);
		 console.log("post index: " + postIndex);
		 console.log("difference");
		 
		 var index = 0;
		 for(postsCounter; postsCounter<postIndex; postsCounter++)
		 {
			 console.log("post counter +1: " + (postsCounter+1));
			 requestPost(postData[postsCounter+1].path, postData[postsCounter+1].title, index);
			 index++;
		 }
		 
		 console.log("A post counter: " + postsCounter);
		 console.log("A post index: " + postIndex);
	 }
 }
 
 
 //sidebar
 function findIndex(evt)
 {
	 var elementClicked = evt.target;
	 
	 var correctElem; //<a> class="list-post-info"
	 var postIndex;
	 
	 if(elementClicked.className == 'list-post-info')
	 {
		e = elementClicked;
	 }
	 else if(elementClicked.parentElement.nodeName == 'a')
	 {
		 //if IE support isn't important, you can use correctElem = $elementClicked.closest('a'); and remove the last else statement
		 correctElem = elementClicked.parentElement;
	 }
	 else
	 {
		 correctElem = elementClicked.parentElement.parentElement;
	 }
	
	 
	 postIndex = correctElem.postIndex;
	 goToPost(postIndex);
 }
 
 
 /*====================*/
 
 
 
 /*==== SCROLL ====*/
 
 function handleScroll()
 {
	 var windowScroll = $window.scrollTop();
	 var windowHeight = $window.height();
	 var contentHeight = $blogContent.height();
	 var morePosts = true;
	 
	 //LOAD a new post when near bottom
	 if(windowScroll + windowHeight > contentHeight - 80)
	 {
		 console.log("Near Bottom");
		 
		 /*
		 *checking whether the 1st post was loaded is needed; if user scrolls to bottom before 1st post loads,
		 *this function is executed before it's actually needed and postsCounter will be larger than it should be.
		 */
		 if(postsCounter < postData.length-1 && firstPostLoaded) 
		 {
			 postsCounter++;
			requestPost(postData[postsCounter].path, postData[postsCounter].title, 0);
		 }
		 else
		 {
			 console.log("No More Posts");
			 morePosts = false;
		 }
	 }
	 
	 
	 
	 fixSidebar(windowScroll);
	
	
	if(windowScroll + windowHeight > contentHeight)
	{
		fillProgBar(true, morePosts);
	}
	else
	{
		fillProgBar(false, morePosts); //also updates hash link when needed
	}
	 
 }
 
 

 
 function fixSidebar(windowScroll)
 {
	 var sidebarTop = $sidebar.offset().top;
	 var firstPostTop = $firstPost.offset().top;
	 var sidebar = document.getElementById("blog-sidebar"); //jQuery vs Native
	 
	  if(windowScroll < firstPostTop && sidebar.style.position == "fixed")
	 {
		 console.log("Unfix sidebar");
		 
		 if(sidebar.style.removeProperty)
		{
			sidebar.style.removeProperty('position');
			sidebar.style.removeProperty('top');
		}
		else //IE <9
		{
			sidebar.style.removeAttribute('position');
			sidebar.style.removeAttribute('top');
		}
	 }
	 
	 else if((!sidebar.style.position && windowScroll >= sidebarTop) || (!sidebar.style.position && (windowScroll+40) >= sidebarTop))
	 {
		 console.log("fix sidebar");
		 $sidebar.css({"position":"fixed", "top":"0"});
	 }
 }
 
 
 
 
 var nextProgbar = false;
 var prevProgbar = false;
 
 //move update hash on scroll to a separate function?
 function fillProgBar(reachedBottom, morePosts)
 {
	 var posts = document.getElementsByClassName("blog-post");
	 var progBars = document.getElementsByClassName("prog-bar");
	 
	 //post being read
	 var post = posts[currentArticle];
	 
	 addClass(progBars[currentArticle].parentElement, 'selected');
	 
	 var postHeight = post.clientHeight;
	 var offsetTop = post.offsetTop;
	 
	 var windowScroll = $window.scrollTop();
	 var relativeScroll = windowScroll - offsetTop;
	 var readPercentage = (relativeScroll/postHeight)*100;
	 
	 
	 
	 if(readPercentage < 100 && readPercentage >= 0)
	 {
		 //console.log("fill progbar NORMAL");
		 var temp = readPercentage+"%";
		progBars[currentArticle].style.width = temp;
		
		nextProgbar = false;
		prevProgbar = false;
	 }
	 else if(readPercentage >= 100 && !prevProgbar)
	 {
		 //console.log("fill progbar EXTRA");
		 
		 progBars[currentArticle].style.width= "100%";
		 removeClass(progBars[currentArticle].parentElement, 'selected');
		 currentArticle++;
		 updateHashScroll(postData[currentArticle].title, windowScroll);
		 nextProgbar = true;
		 fillProgBar();
	 }
	 else if(readPercentage < 0 && !nextProgbar)
	 {
		 progBars[currentArticle].style.width= "0";
		 if(currentArticle >0)
		 {
			 //console.log("fill progbar LESS");
			 removeClass(progBars[currentArticle].parentElement, 'selected');
			currentArticle--;
			updateHashScroll(postData[currentArticle].title, windowScroll);
			prevProgbar = true;
			fillProgBar();
			
		 }
		 //console.log("going back");
	 }
	 
	 
	  if(reachedBottom && !morePosts)
	 {
		 /*
		 * if 1st article progBar hasn't commenced & you hit the End key (with no more posts to load):
		 * 1- progBars don't get filled
		 * 2- currentArticle doesn't get updated
		 *  
		 * Solution: fill all progBars and set currentArticle to last article
		 */
		 for(var i =0; i<progBars.length; i++)
		 {
			progBars[i].style.width= "100%";
			removeClass(progBars[i].parentElement, 'selected');
		 }
		 
		 currentArticle = progBars.length-1;
		 addClass(progBars[currentArticle].parentElement, 'selected');
		 progBars[currentArticle].style.width= "100%";
	 }
	 
	 
	 if(currentArticle==0 && !window.location.hash)
	 {
		updateHashScroll(postData[currentArticle].title, windowScroll);
	 }
	
 }
 
 
 function updateHashScroll(title, windowScroll)
 {
	
	if(history && history.replaceState)
	{
		history.replaceState({}, "", 'blog#'+ hashTitle(title));
	}
	else
	{
		window.location.hash = hashTitle(title);
		document.body.scrollTop = windowScroll; //prevent scroll to anchor
	}
 }
 /*====================*/
 
 
 
 /*==== HASH URL ====*/
 
 //on load
 function checkHash()
 {
	 console.log("checking hash");
	 var hash;
	 if(window.location.hash)
	 {
		 hash = window.location.hash;
		 hash = hash.replace(/_/g , " ");
		 hash = hash.substring(1); //remove '#'
		 for(var i=0; i<postData.length; i++)
		 {
			 var title = postData[i].title;
			 if(hash == title)
			 {
				 goToPost(i);
				 break;
			 }
			 
		 }
	 }
	 
 }
 
 function hashTitle(title)
 {
	 title = title.replace(/ /g , "_");
	 //title = "#"+title;
	 return title;
 }