//===================================================================================
// VARIABLE DECLARATIONS
//===================================================================================
var numBlogPosts = 0; // Number of posts (.txt files in blog post folder)
var scroll = 0; // How far the user has scrolled down the page 
var lastArticleLoaded = 0; // Last article that was loaded
var currentArticle = 0; // Current article the user is on 
var articleTitles = []; //Store the parsed title of each article
var loadedArticles = []; //Store all the articles that have already been loaded
var topArchivePost = 0; // Article currently on top of archive list
var startFromArticle = null; // First post that was loaded   
var emptyCurrentPost = false; //If the user presses home the post they are going to will need to be completely emptied
var hashNotValid = false; //A hash value is entered in the url that does not correspond to any existing article
var archive_record_height = 0; // Height of a single record in the archive sidebar
//===================================================================================
// END
//===================================================================================




//===================================================================================
// SHOW / HIDE ARCHIVE SIDEBAR
//===================================================================================
var animateSidebar;
var archiveHidden = false;
var sidebarObject = null;
var sidebarMoving = false;

function toggleArchiveDisplay() 
{
  sidebarObject = document.getElementById("blog_archive");
  var show_hide_sidebar_button = document.getElementById("archive_display_button");
  
  if(sidebarMoving == false)
  {
    if(archiveHidden == true)
      moveSidebarRight();
    else
      moveSidebarLeft();
  }
}

function moveSidebarLeft()
{
  sidebarObject.style.left = parseInt(sidebarObject.style.left) - 20 + 'px';

  if(parseInt(sidebarObject.style.left) != -300)
  {
     animateSidebar = setTimeout(moveSidebarLeft,20);
     sidebarMoving = true;
  }
  else
  {
    archiveHidden = true;
    sidebarMoving = false;
  }
}

function moveSidebarRight()
{
  sidebarObject.style.left = parseInt(sidebarObject.style.left) + 20 + 'px';
  if(parseInt(sidebarObject.style.left) != 40)
  {
     animateSidebar = setTimeout(moveSidebarRight,20);
     sidebarMoving = true;
  }
  else
  {
    archiveHidden = false;
    sidebarMoving = false;
  }
}
//===================================================================================
// END :: SHOW / HIDE ARCHIVE SIDEBAR
//===================================================================================





//===================================================================================
// RETURNS HOW FAR USER HAS SCROLLED DOWN PAGE
//===================================================================================
 function getScrollTop() 
  {
    var doc = document.documentElement;
    if (doc.scrollTop != 0) 
      return doc.scrollTop;
    else
      return document.body.scrollTop;
  }
//===================================================================================
// END :: RETURNS HOW FAR USER HAS SCROLLED DOWN PAGE
//===================================================================================





//===================================================================================
// RETURNS POSITION OF AN ELEMENT
//===================================================================================
  function getPos(element) 
  {
      for (var xPos=0, yPos=0;
           element != null;
           xPos += element.offsetLeft, yPos += element.offsetTop, element = element.offsetParent);
      return yPos;
  }
//===================================================================================
// END :: RETURNS POSITION OF AN ELEMENT
//===================================================================================





//===================================================================================
// DETERMILE ARTICLE TO START AT AND CALL FUNCTIONS ON LOAD
//===================================================================================
window.onload = function() 
{
  //URL is hashed on load
  if(window.location.hash) 
  {
    var hashLocation = window.location.hash;

    //If hash location is an image reference reload at first article (problem was coused by refreshing on image)
    if(hashLocation.indexOf("_fullsize_image_") > -1 || hashLocation.indexOf("close") > -1)
    {
      lastArticleLoaded = 0;
      startFromArticle = 0;
      addArticle();
      generateArchive();
    }
    else
    {
      var articleExists = false;

      for(var i = 0; i < numBlogPosts; i++)
      {
        //Load at a particular blog post
        if(window.location.hash == "#"+articleTitles[i])
        {
          articleExists = true;
          lastArticleLoaded = i;
          startFromArticle = i;
          currentArticle++;
          addArticle();
          generateArchive();
        }
      }
        
      if(articleExists == false)
      {
        hashNotValid = true;
        lastArticleLoaded = 0;
        startFromArticle = 0;
        addArticle();
        generateArchive();
      }
    }
  }

  // URL not hashed on load
  else
  {
    lastArticleLoaded = 0;
    startFromArticle = 0;
    addArticle();
    generateArchive();
  }
};
//===================================================================================
// END :: DETERMILE ARTICLE TO START AT AND CALL FUNCTIONS ON LOAD
//===================================================================================


//===================================================================================
// ADD ARTICLE TITLES TO ARRAY
//===================================================================================
var fileNames = [];
function addArticleInfo()
{
  numBlogPosts++;
  var count = arguments[1];
  fileNames[count] = arguments[0];
  
  // CREATE PARSED TITLE 
  var fn = fileNames[count];
  var fn_without_date = fn.split("_",1); 
  parseFileTitle(fn_without_date, arguments[1]);
}

function parseFileTitle()
{
  var count = arguments[1];
  var str = arguments[0].toString();
  var noSpecialCharacters = str.replace(/[^a-zA-Z0-9 ]/g, "");
  var lowerCase = noSpecialCharacters.toLowerCase(); 
  var noSpaces = lowerCase.replace(/ /g,"_");
  articleTitles[count] = noSpaces;
  return noSpaces;
}
//===================================================================================
// END
//===================================================================================





//===================================================================================
// ADD ARTICLE
//===================================================================================
var processing = false;

function addArticle()
{
  var loading = document.getElementById("loading"); 

  if(lastArticleLoaded < numBlogPosts && processing == false)
  {
      if(lastArticleLoaded == 0)
      {
        if(window.location.hash) 
        {
          var hashLocation = window.location.hash;
          
          if(hashLocation.indexOf("_fullsize_image_") > -1 || hashLocation.indexOf("close") > -1 || hashNotValid == true)
          {
            hashNotValid = false;
            
            var title = articleTitles[currentArticle];
                  
            if(history.pushState) 
              history.pushState(null, null, 'blog.php#'+ title );
            else 
              location.hash = title;
          }
          else
          {
            for(var i = 0; i < numBlogPosts; i++)
            {
              if(window.location.hash == "#"+articleTitles[i])
              {
                lastArticleLoaded = i;
                startFromArticle = i;
                processing = true;
                var httpRequest = new XMLHttpRequest(); 
                var url = "parse_blog_file.php"; 
                var vars = "articleNum="+lastArticleLoaded+"&articleTitle="+fileNames[lastArticleLoaded]; 
                httpRequest.open("POST", url, true); 
                httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 

                httpRequest.onreadystatechange = function() 
                { 
                  if(httpRequest.readyState == 4 && httpRequest.status == 200) 
                  { 
                     // Add article name to array of loaded articles
                    loadedArticles.push(articleTitles[lastArticleLoaded]);
                    var return_data = httpRequest.responseText; 
                    wrap.innerHTML += return_data;  
                    processing = false;   
                    lastArticleLoaded++;
                    loading.style.display = 'none'; 
                  }
                } 
                loading.style.display = 'block';
                httpRequest.send(vars);
              }
            }
          }
        }
        else
        {
          processing = true;
          var httpRequest = new XMLHttpRequest(); 
          var url = "parse_blog_file.php"; 
          var vars = "articleNum="+lastArticleLoaded+"&articleTitle="+fileNames[lastArticleLoaded]; 
          httpRequest.open("POST", url, true); 
          httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 

          httpRequest.onreadystatechange = function() 
          { 
            if(httpRequest.readyState == 4 && httpRequest.status == 200) 
            {  
              //REPOSITION SIDBAR
              var box = document.getElementById('blog_archive');
              var show_hide_sidebar = document.getElementById('show_hide_archive');

              scroll = getScrollTop();

              if (scroll <= 228) 
              {
                show_hide_sidebar.style.top = "228px";
                show_hide_sidebar.style.position = "absolute";
                box.style.top = "228px";
                box.style.position = "absolute";
              }
              else
              {
                show_hide_sidebar.style.top = "0px";
                show_hide_sidebar.style.position = "fixed";
                box.style.top = "0px";
                box.style.position = "fixed";
              }

              // Add article name to array of loaded articles
              loadedArticles.push(articleTitles[lastArticleLoaded]);

              var return_data = httpRequest.responseText; 
              wrap.innerHTML += return_data;  
              processing = false;   
              lastArticleLoaded++;
              loading.style.display = 'none'; 
            }
          } 
          loading.style.display = 'block';        
          httpRequest.send(vars);
        }
      }

      // COUNT > 0
      else
      {
          processing = true;
          var httpRequest = new XMLHttpRequest(); 
          var url = "parse_blog_file.php"; 
          var vars = "articleNum="+lastArticleLoaded+"&articleTitle="+fileNames[lastArticleLoaded]; 
          httpRequest.open("POST", url, true); 
          httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 

          httpRequest.onreadystatechange = function() 
          { 
            if(httpRequest.readyState == 4 && httpRequest.status == 200) 
            {  
              //REPOSITION SIDBAR
              var box = document.getElementById('blog_archive');
              var show_hide_sidebar = document.getElementById('show_hide_archive');

              scroll = getScrollTop();

              if (scroll <= 228) 
              {
                show_hide_sidebar.style.top = "228px";
                show_hide_sidebar.style.position = "absolute";
                box.style.top = "228px";
                box.style.position = "absolute";
              }
              else
              {
                show_hide_sidebar.style.top = "0px";
                show_hide_sidebar.style.position = "fixed";
                box.style.top = "0px";
                box.style.position = "fixed";
              }

              // Add article name to array of loaded articles
              loadedArticles.push(articleTitles[lastArticleLoaded]);
              var return_data = httpRequest.responseText; 
              wrap.innerHTML += return_data;  
              processing = false;   
              lastArticleLoaded++;
              loading.style.display = 'none'; 
            }
          } 
          loading.style.display = 'block';    
          httpRequest.send(vars);
    }
  }
  else if(lastArticleLoaded == numBlogPosts)
  {
     //loading.style.display = 'none'; 
  }
}
//===================================================================================
// END :: ADD ARTICLE
//===================================================================================





//===================================================================================
// GENERATE ARTICLE ARCHIVE
//===================================================================================
function generateArchive()
{   
    var httpRequestArchive = new XMLHttpRequest(); 
    var url = "generate_article_archive.php";
    topArchivePost = lastArticleLoaded; 
    var vars = "articleNum="+topArchivePost; 
    httpRequestArchive.open("POST", url, true); 
    httpRequestArchive.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 

    httpRequestArchive.onreadystatechange = function() 
    { 
      if(httpRequestArchive.readyState == 4 && httpRequestArchive.status == 200) 
      {  
        var blog_archive = document.getElementById('blog_archive');
        var return_data = httpRequestArchive.responseText; 
        blog_archive.innerHTML += return_data;  

        // ONLY DISPLAY 10 BLOG ENTRIES IN ARCHIVE 
        for(var i = topArchivePost; i < numBlogPosts; i++)
        {
          if(i >= topArchivePost + 10)
          {
            var blog_entry_scroll_id = "blog_entry_scroll_" + i;
            var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
            var blog_article_archive_id = "blog_article_archive_" + i;
            var blog_article_archive = document.getElementsByClassName(blog_entry_scroll_id); 
            blog_entry_scroll.style.display = 'none';
          }
        }

        if(archive_record_height == 0)
        {
          archive_record_height = document.getElementById('blog_article_archive').clientHeight;
        }
      }
    } 
    httpRequestArchive.send(vars);
    window.scrollTo(0,0);
}
//===================================================================================
// END :: GENERATE ARTICLE ARCHIVE
//===================================================================================






//===================================================================================
// HANDLE SCROLL
//===================================================================================
function handleScroll()
{
  scroll = getScrollTop();
  
  //===================================================================================
  // HIDE FOOTER IF IT IS CURRENTLY VISIBLE
  //===================================================================================
  if(footerHidden == false)
  {
    showHideFooter();
  }
  //===================================================================================
  // END :: HIDE FOOTER IF IT IS CURRENTLY VISIBLE
  //===================================================================================





  //===================================================================================
  // STOP SIDEBAR GOING ABOVE TITLE BAR 
  //===================================================================================
  var box = document.getElementById('blog_archive');
  var show_hide_sidebar = document.getElementById('show_hide_archive');
  var clientHeight = document.getElementById('blog_archive').clientHeight; 
  var body = document.body, html = document.documentElement;
  
  if (scroll <= 228) 
  {
    show_hide_sidebar.style.top = "228px";
    show_hide_sidebar.style.position = "absolute";
    box.style.top = "228px";
    box.style.position = "absolute";
  }
  else
  {
    show_hide_sidebar.style.top = "0px";
    show_hide_sidebar.style.position = "fixed";
    box.style.top = "0px";
    box.style.position = "fixed";
  }
  //===================================================================================
  // END :: STOP SIDEBAR GOING ABOVE TITLE BAR 
  //===================================================================================





  //===================================================================================
  // ARTICLE CHANGE
  //===================================================================================
  if(startFromArticle == null)
  {
    if(window.location.hash) 
    {
      var hashLocation = window.location.hash;
      if(hashLocation.indexOf("_fullsize_image_") > -1 || hashLocation.indexOf("close") > -1)
      {
        // DO NOTHING
      }
      else
      {
        for(var i = 0; i < numBlogPosts; i++)
        {
          if(window.location.hash == "#"+articleTitles[i])
          {
            lastArticleLoaded = i;
            startFromArticle = i;
          }
        }
      }
    }
    else
    {
       startFromArticle = 0;  
    }
  }
  else
  {
    var valueForLoop = 0;     
    if(startFromArticle > 0)
    {
      valueForLoop = startFromArticle-1;
    }
  
    //===================================================================================
    // FILL SIDEBAR ON SCROLL
    //===================================================================================
    //Get position of next blog entry
    var next_blog_entry_id = "blog_entry_" + (currentArticle+1);
    var next_blog_entry = document.getElementById(next_blog_entry_id);
    var next_blog_entry_top = getPos(next_blog_entry);

    // Get position of blog entry  
    var blog_entry_id = "blog_entry_" + currentArticle;
    var blog_entry = document.getElementById(blog_entry_id);
    var blog_entry_top = getPos(blog_entry);
    var blog_entry_height = next_blog_entry_top - blog_entry_top;

    // Get scroll section 
    var blog_entry_scroll_id = "blog_entry_scroll_" + currentArticle;
    var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
               
    if(blog_entry_scroll != null)
      blog_entry_scroll.style.background = "#d9e3f5";
          
    if(scroll > blog_entry_top && scroll < next_blog_entry_top)
    {
      var relative_scroll = scroll - blog_entry_top;
      var percent_article_read = (relative_scroll / blog_entry_height);
      var archive_width = document.getElementById('blog_article_archive').clientWidth;
      var scroll_width = archive_width * percent_article_read;
      var scroll_height = archive_record_height * percent_article_read;
      if(blog_entry_scroll != null)
        blog_entry_scroll.style.height = scroll_height + "px";
    } 

    if(emptyCurrentPost == true)
    {
      emptyCurrentPost = false;
      if(blog_entry_scroll != null)
        blog_entry_scroll.style.background = "none";

    }

    //clear all the scroll backgrounds after current article
    for(var i = currentArticle + 1; i < numBlogPosts; i++)
    {
      var blog_entry_scroll_id = "blog_entry_scroll_" + i;
      var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
               
      if(blog_entry_scroll != null)
        blog_entry_scroll.style.background = "none";
    }

    //fill all the scroll backgrounds before current article
    for(var i = currentArticle - 1; i > topArchivePost-1; i--)
    {
      var blog_entry_scroll_id = "blog_entry_scroll_" + i;
      var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
               
      if(blog_entry_scroll != null)
        blog_entry_scroll.style.background = "#d9e3f5";//rgba(129,129,129,0.3)

      var percent_article_read = 1;
      var scroll_height = archive_record_height * percent_article_read;
      if(blog_entry_scroll != null)
        blog_entry_scroll.style.height = scroll_height + "px";
    }
    //===================================================================================
    // END :: FILL SIDEBAR ON SCROLL
    //===================================================================================  



    //===================================================================================
    // POST CHANGE
    //===================================================================================
    for(var i = valueForLoop; i < lastArticleLoaded; i++)
    {
      var articleId = "blog_entry_"+i;
      var article = document.getElementById(articleId);
      
      if(article != null)
        var articleHeight = article.offsetHeight;
      
      var articleTop = getPos(article);
      var articleBottom = articleTop+articleHeight;
    
      //===================================================================================
      // CHANGE : First Post
      //===================================================================================
      if(lastArticleLoaded == 0 || i == startFromArticle)
      {
        if(scroll >= articleTop && scroll <= articleBottom)
        {
          var blog_article_selected_id = "blog_article_selected_" + i;
          var blog_article_selected = document.getElementById(blog_article_selected_id);
          currentArticle = i;
          
          var title = articleTitles[currentArticle];

          if(history.pushState) 
              history.pushState(null, null, 'blog.php#'+ title );
          else 
              location.hash = title;
        }
      }
      //===================================================================================
      // END OF CHANGE : First Post
      //===================================================================================



      //===================================================================================
      // CHANGE : Last Post
      //===================================================================================
      else if(i+1 == numBlogPosts)
      {
        if(scroll >= articleTop - 15)
        {
          //Update Selected Article Identifier
          var blog_article_selected_id = "blog_article_selected_" + i;
          var blog_article_selected = document.getElementById(blog_article_selected_id);
          
          if(blog_article_selected != null)
            blog_article_selected.style.background = "#628196";
        
          currentArticle = i;
          
          for(var i = startFromArticle; i < lastArticleLoaded-1; i++)
          {
            var blog_article_deselected_id = "blog_article_selected_" + i;
            var blog_article_deselected = document.getElementById(blog_article_deselected_id);
            blog_article_deselected.style.background = "rgba(0,0,0,0)";
          }

          var title = articleTitles[i];

          if(history.pushState) 
              history.pushState(null, null, 'blog.php#'+ title);
          else 
              location.hash = title;
        }
      }
      //===================================================================================
      // END OF CHANGE : Last Post
      //===================================================================================



      //===================================================================================
      // CHANGE : Middle Post
      //===================================================================================
      else if(i>startFromArticle && i < numBlogPosts-1)
      {
        var nextArticleIdentifier = i+1;
        var nextArticleId = "blog_entry_"+nextArticleIdentifier;
        var nextArticle = document.getElementById(nextArticleId);
        var nextArticleTop = getPos(nextArticle);

        if(scroll >= articleTop - 15 && scroll < nextArticleTop-15)
        {
          currentArticle = i;

          

          var title = articleTitles[i];

          if(history.pushState) 
              history.pushState(null, null, 'blog.php#'+ title);
          else 
              location.hash = title;

       

          //===================================================================================
          // MOVE ARCHIVE DOWN
          //===================================================================================
          if(currentArticle == topArchivePost + 9)
          {         
            for(var i = topArchivePost; i < topArchivePost+9; i++)
            {
              if(i >= topArchivePost)
              {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'none';
              }
            }
            
            topArchivePost += 9;

            //Hit the last post within the next 10
            if(topArchivePost+9 >= numBlogPosts)
            {
              for(var i = topArchivePost+1; i < numBlogPosts; i++)
              {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'block';
              
              }
            }
            else 
            {
              for(var i = topArchivePost+1; i < topArchivePost + 10; i++)
              {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'block';
              }
            } 

          }
          //===================================================================================
          // MOVE ARCHIVE UP
          //===================================================================================
          if(currentArticle == topArchivePost-1)
          {
            //less than 10 currently displayed
            if(topArchivePost+9 >= numBlogPosts)
            {
              for(var i = topArchivePost; i < numBlogPosts; i++)
              {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'none';
              }
            }
            else
            {
              for(var i = topArchivePost+1; i < topArchivePost+11; i++)
              {
                if(i >= topArchivePost-1)
                {
                  var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                  var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                  blog_entry_scroll.style.display = 'none';
                }
              }
            }
            
            topArchivePost -= 9;

            for(var i = topArchivePost; i <  topArchivePost + 10; i++)
            {
              var blog_entry_scroll_id = "blog_entry_scroll_" + i;
              var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
              blog_entry_scroll.style.display = 'block';
            }
          }
          //===================================================================================
          // END
          //===================================================================================
        }
      }
      //===================================================================================
      // END OF CHANGE : Middle Post
      //===================================================================================
    } 
    //===================================================================================
    // END :: POST CHANGE
    //===================================================================================
  }
  //Update Selected Article Identifier
  var blog_article_selected_id = "blog_article_selected_" + currentArticle;
  var blog_article_selected = document.getElementById(blog_article_selected_id);
  if(blog_article_selected != null)
    blog_article_selected.style.background = "#628196";

  for(var j = currentArticle - 1; j >= topArchivePost; j--)
  {
    var blog_article_deselected_id = "blog_article_selected_" + j;
    var blog_article_deselected = document.getElementById(blog_article_deselected_id);
    if(blog_article_deselected != null)
      blog_article_deselected.style.background = "rgba(0,0,0,0)";
  }

  for(var k = currentArticle + 1; k < numBlogPosts; k++)
  {
    var blog_article_deselected_id = "blog_article_selected_" + k;
    var blog_article_deselected = document.getElementById(blog_article_deselected_id);
    if(blog_article_deselected != null)
      blog_article_deselected.style.background = "rgba(0,0,0,0)";
  }

  //===================================================================================
  // END :: ARTICLE CHANGE
  //===================================================================================


    
  //===================================================================================
  // ADD NEW POST WHEN USER REACHES PAGE BOTTOM
  //===================================================================================
  var body = document.body, html = document.documentElement;
  var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  var h = window.innerHeight;
  var pageBottom = height - h;  
  
 // if (scroll == pageBottom || scroll == pageBottom-10 || scroll == pageBottom-20)
  if (scroll <= pageBottom && scroll >= pageBottom-20)
  {
    addArticle();
  }
  //===================================================================================
  // END
  //===================================================================================
} 
window.onscroll = handleScroll;

//===================================================================================
// END :: HANDLE SCROLL
//===================================================================================





//===================================================================================
// HASH CHANGE
//===================================================================================
  function locationHashChanged() 
  {   
    var hashLocation = window.location.hash;
    // Go to blog entry via click on archive
    if(hashLocation.indexOf("blog_entry_") > -1)
    {     
      var result = window.location.hash.split('blog_entry_');
      var hashArticleTitle = articleTitles[result[1]-1];

      var loaded = false;
      
      for (var i = 0; i < loadedArticles.length; i++) 
      {
        if(loadedArticles[i] == hashArticleTitle)
        {
          loaded = true;
          break;
        }
      }
      if(loaded == false)
      {
        hashArticleTitle = articleTitles[result[1]];

        if(history.pushState) 
          history.pushState(null, null, 'blog.php#'+ hashArticleTitle);
        else 
          location.hash = hashArticleTitle;
        
        window.location.reload(true);
       }
       else
       {
       }
    }

    // Go to image 
    else if(hashLocation.indexOf("_fullsize_image_") > -1)
    {
      //Do Nothing
    }

    // Image close (go back to current article)
    else if(hashLocation.indexOf("close") > -1)
    {
        var title = articleTitles[currentArticle];
        if(history.pushState) 
            history.pushState(null, null, 'blog.php#'+ title);
        else 
            location.hash = title;
    }

    // hash changed to article title
    else
    {
      var articleExists = false;
      var titleWithHash = hashLocation.split('#');
      var titleWithoutHash = titleWithHash[1];
      var recordLoaded = false;

      for (var i = 0; i < articleTitles.length; i++) 
      { 
        if(articleTitles[i] == titleWithoutHash)
        {
          articleExists = true;
          break;
        }
      }
      
      if(articleExists == true)
      {
        for (var i = 0; i < loadedArticles.length; i++) 
        {
          if(loadedArticles[i] == titleWithoutHash)
          { 
             //===================================================================================
          // MOVE ARCHIVE UP
          //===================================================================================

          if(topArchivePost+9 >= numBlogPosts)
          {
            for(var i = topArchivePost; i < numBlogPosts; i++)
            {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'none';
              }
            }
            else
            {
              for(var i = topArchivePost+1; i < topArchivePost+11; i++)
              {
                if(i >= topArchivePost-1)
                {
                  var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                  var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                  blog_entry_scroll.style.display = 'none';
                }
              }
            }
            
            topArchivePost = startFromArticle;

            for(var i = topArchivePost; i <  topArchivePost + 10; i++)
            {
              var blog_entry_scroll_id = "blog_entry_scroll_" + i;
              var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
              blog_entry_scroll.style.display = 'block';
            }
          
          //===================================================================================
          // END :: MOVE ARCHIVE UP
          //===================================================================================  
            recordLoaded = true;
            break;     
          }
        }
        if(recordLoaded == false)
        {
          window.location.reload(true);
        }
      }
    }
  }
  window.onhashchange = locationHashChanged;
  //===================================================================================
  // END :: HASH CHANGE
  //===================================================================================






  //===================================================================================
  // CLICK ON ARCHIVE                                                                  
  //===================================================================================
  function goToPost(postNum)
  {   
    postNum+=1;
    
    if(postNum-1 != currentArticle)
    {
      if(postNum>startFromArticle && postNum < currentArticle+1) 
      {
        if(postNum != startFromArticle+1)
        {
          postNum-=1;
          currentArticle = postNum; 
        }
        else
        {
          currentArticle = startFromArticle; 
        }
      }
      else
      {
        postNum-=1;
        currentArticle = postNum; 
      }
      location.hash = "#blog_entry_" + currentArticle;
    }
    emptyCurrentPost = true;
  }
  //===================================================================================
  // END :: CLICK ON ARCHIVE
  //===================================================================================






  //===================================================================================
  // UPDATE SELECTED ARTICLE AND ARCHIVE ON HOME BUTTON PRESS
  //===================================================================================
  function handleKeyPress(e) 
  {
    if (e.keyCode == 36) 
    {
        var blog_article_selected_id = "blog_article_selected_" + startFromArticle;
        var blog_article_selected = document.getElementById(blog_article_selected_id);
        blog_article_selected.style.background = "#628196";
        emptyCurrentPost = true;
        for (var i = lastArticleLoaded-1; i > startFromArticle; i--)
        {
          var blog_article_deselected_id = "blog_article_selected_" + i;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)"; 
        }
        //===================================================================================
        // MOVE ARCHIVE UP
        //===================================================================================
          if(topArchivePost+9 >= numBlogPosts)
          {
            for(var i = topArchivePost; i < numBlogPosts; i++)
            {
              var blog_entry_scroll_id = "blog_entry_scroll_" + i;
              var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
              blog_entry_scroll.style.display = 'none';
            }
          }
          else
          {
            for(var i = topArchivePost+1; i < topArchivePost+11; i++)
            {
              if(i >= topArchivePost-1)
              {
                var blog_entry_scroll_id = "blog_entry_scroll_" + i;
                var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
                blog_entry_scroll.style.display = 'none';
              }
            }
          }
          
          topArchivePost = startFromArticle;

          for(var i = topArchivePost; i <  topArchivePost + 10; i++)
          {
            var blog_entry_scroll_id = "blog_entry_scroll_" + i;
            var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
            blog_entry_scroll.style.display = 'block';
          }
        
        //===================================================================================
        // END :: MOVE ARCHIVE UP
        //===================================================================================
    }
  }
  window.addEventListener("keydown", handleKeyPress, false);
  //===================================================================================
  // END :: UPDATE SELECTED ARTICLE AND ARCHIVE ON HOME BUTTON PRESS
  //===================================================================================





  //===================================================================================
  // SHOW / HIDE FOOTER
  //===================================================================================
  var footerMoving = false;
  var footerHidden = true;
  var animateFooter;
  var footerHeight;
  var footer;

  function showHideFooter()
  {
     footer = document.getElementById("blog_footer");
     footerHeight = footer.offsetHeight;

    if(footerMoving == false)
    {
      if(footerHidden == true)
        moveFooterUp();
      else
        moveFooterDown();
    }
  }

function moveFooterDown()
{
  footer.style.bottom = parseInt(footer.style.bottom) - 20 + 'px';
  
  if(parseInt(footer.style.bottom) != -640)
  {
     animateFooter = setTimeout(moveFooterDown,20);
     footerMoving = true;
  }
  else
  {
    footerHidden = true;
    footerMoving = false;
  }
}


function moveFooterUp()
{
  footer.style.bottom = parseInt(footer.style.bottom) + 20 + 'px';
  
  if(parseInt(footer.style.bottom) != 0)
  {
     animateFooter = setTimeout(moveFooterUp,20);
     footerMoving = true;
  }
  else
  {
    footerHidden = false;
    footerMoving = false;
  }
}
//===================================================================================
// END :: SHOW / HIDE FOOTER
//===================================================================================




