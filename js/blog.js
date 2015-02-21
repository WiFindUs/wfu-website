var height;
var numBlogPosts = 0;
var animateSidebar;
var archiveHidden = false;
var sidebarObject = null;
var sidebarMoving = false;
var show_hide_sidebar_button;
var startFromArticle = 0; //Article num the user starts from
var scroll = 0; // How far the user has scrolled down the page 

var count = 0;
var currentArticle = 0;
var articleTitles = []; //Store the parsed title of each article
var loadedArticles = []; //Store all the articles that have already been loaded
var urlHashedOnLoad = false;
var topArchivePost = 0;
//==================================

var imageCount = 0;


var archive_record_height = 0;


function addArchive()
{
  numBlogPosts++;
}

function toggleArchiveDisplay()
{
  sidebarObject = document.getElementById("blog_archive");
  show_hide_sidebar_button = document.getElementById("archive_display_button");
  
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
  if(parseInt(sidebarObject.style.left) != 0)
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

 function getScrollTop() 
  {
    var d = document.documentElement;
    if (d.scrollTop != 0) 
      return d.scrollTop;
    else
      return document.body.scrollTop;
  }

  function getPos(el) 
  {
      for (var lx=0, ly=0;
           el != null;
           lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
      return ly;
  }

window.onload = function() 
{
  hashCheck();
  document.getElementById("blog_archive").style.left = "0px";
  var currnentArticleNum = 0;
};


//===================================================================================
// CHECK FOR HASH IN THE URL WHEN PAGE LOADS
//===================================================================================
function hashCheck()
{
  if(window.location.hash) 
  {
    urlHashedOnLoad = true;
    
    for(var i = 0; i < numBlogPosts; i++)
    {
      if(window.location.hash == "#"+articleTitles[i])
        count = i+1;
    }
  }
  addArticle();
  generateArchive();
}
//===================================================================================
// END
//===================================================================================





//===================================================================================
// REMOVE SPACES AND SPECIAL CHARACTERS FROM POST TILES FOR USE IN URL
//===================================================================================
function parseFileTitle(title, count)
{
  var str = title.toString();
  var noSpecialCharacters = str.replace(/[^a-zA-Z0-9 ]/g, "");
  var lowerCase = noSpecialCharacters.toLowerCase(); 
  var noSpaces = lowerCase.replace(/ /g,"_");
  articleTitles[arguments[1]-1] = noSpaces;
  return noSpaces;
}
//===================================================================================
// END
//===================================================================================






//=============================================== FOR AJAX AND SEO STUFF ===============================================










var fileNames = [];
function addArticleInfo(title,count)
{
  numBlogPosts++;
  fileNames[arguments[1]] = arguments[0];
  
  // CREATE PARSED TITLE 
  var fn = fileNames[arguments[1]];
  var fn_without_date = fn.split("_",1); 
  parseFileTitle(fn_without_date, arguments[1]);
}









var processing = false; //AJAX request is processing
function addArticle()
{
  if(count < numBlogPosts && processing == false)
  {
    processing = true;
    
    var httpRequest = new XMLHttpRequest(); 
    var url = "parse_blog_file.php"; 
    var vars = "articleNum="+count+"&articleTitle="+fileNames[count]; 
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
        loadedArticles.push(articleTitles[count-1]);


        var return_data = httpRequest.responseText; 
        wrap.innerHTML += return_data;  
        processing = false;   
        count++;
      }
    } 
    httpRequest.send(vars);
  }

}



function generateArchive()
{   
    var httpRequestArchive = new XMLHttpRequest(); 
    var url = "generate_article_archive.php"; 
    var vars = "articleNum="+count/*+"&articleTitle="+fileNames[count]*/; 
    startFromArticle = count;
    httpRequestArchive.open("POST", url, true); 
    httpRequestArchive.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 

    httpRequestArchive.onreadystatechange = function() 
    { 
      if(httpRequestArchive.readyState == 4 && httpRequestArchive.status == 200) 
      {  
        var blog_archive = document.getElementById('blog_archive');
        var return_data = httpRequestArchive.responseText; 
        blog_archive.innerHTML += return_data;  

        topArchivePost = count;

        //===========================================================
        // ONLY DISPLAY 10 BLOG ENTRIES IN ARCHIVE ==================
        for(var i = topArchivePost; i < numBlogPosts; i++)
        {
          if(i >= topArchivePost + 9)
          {
            var blog_entry_scroll_id = "blog_entry_scroll_" + i;
            var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 

            var blog_article_archive_id = "blog_article_archive_" + i;
            var blog_article_archive = document.getElementsByClassName(blog_entry_scroll_id); 

            blog_entry_scroll.style.display = 'none';

            if(archive_record_height == 0)
            {
              archive_record_height = document.getElementById('blog_article_archive').clientHeight;
            }
          }
        }
        //===========================================================

      }
    } 
    httpRequestArchive.send(vars);
    
}



function yHandler()
{
   scroll = getScrollTop();

  //===================================================================================
  // STOP SIDEBAR GOING ABOVE TITLE BAR 
  //===================================================================================
  var box = document.getElementById('blog_archive');
  var show_hide_sidebar = document.getElementById('show_hide_archive');
  var clientHeight = document.getElementById('blog_archive').clientHeight; 
  var footerHeight = document.getElementById('footer').clientHeight;

  var stopScrollFooter = height-clientHeight-footerHeight;
  var body = document.body, html = document.documentElement;
  height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  var stopScroll = height - (footerHeight+clientHeight);
  
  if (scroll <= 228) 
  {
    show_hide_sidebar.style.top = "228px";
    show_hide_sidebar.style.position = "absolute";
    box.style.top = "228px";
    box.style.position = "absolute";
  }
  else if(scroll > stopScrollFooter)
  {
    var sidebarStopPosition = height - (clientHeight + footerHeight- 1);
    box.style.position = "absolute";
    box.style.top = sidebarStopPosition + "px";
    show_hide_sidebar.style.top = sidebarStopPosition + "px";
    show_hide_sidebar.style.position = "absolute";
  }
  else if(scroll < stopScrollFooter)
  {
      show_hide_sidebar.style.top = "0px";
      show_hide_sidebar.style.position = "fixed";
      box.style.top = "0px";
      box.style.position = "fixed";
  } 
  //===================================================================================
  // END
  //===================================================================================









  //===================================================================================
  // ARTICLE CHANGE
  //===================================================================================

  for(var i = startFromArticle; i < count; i++)
  {
    var articleId = "blog_entry_"+i;
    var article = document.getElementById(articleId);
    var articleHeight = article.offsetHeight; 
    var articleTop = getPos(article);
    var articleBottom = articleTop+articleHeight;
    
    //First article
    if(count == 1 || i == startFromArticle)
    {
 

      if(scroll >= articleTop && scroll <= articleBottom)
      {
        //Update Selected Article Identifier
        var blog_article_selected_id = "blog_article_selected_" + startFromArticle;
        var blog_article_selected = document.getElementById(blog_article_selected_id);
        blog_article_selected.style.background = "#628196";
        currentArticle = i;
        
        for (var i = count-1; i > startFromArticle; i--)
        {
          var blog_article_deselected_id = "blog_article_selected_" + i;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)"; 
        }

        var title = articleTitles[i-1];

        if(history.pushState) 
            history.pushState(null, null, 'blog.php#'+ title );
        else 
            location.hash = title;
      }
    }

    // Last Article
    else if(i == count-1)
    {
      if(scroll >= articleTop - 15)
      {

        //Update Selected Article Identifier
        var blog_article_selected_id = "blog_article_selected_" + i;
        var blog_article_selected = document.getElementById(blog_article_selected_id);
        blog_article_selected.style.background = "#628196";
        currentArticle = i;
        
        for(var i = startFromArticle; i < count-1; i++)
        {
          var blog_article_deselected_id = "blog_article_selected_" + i;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)";
        }

        var title = articleTitles[i-1];

        if(history.pushState) 
            history.pushState(null, null, 'blog.php#'+ title);
        else 
            location.hash = title;
      }
    }

    //Middle Article 
    else if(i>startFromArticle && i<count-1)
    {
      var nextArticleIdentifier = i+1;
      var nextArticleId = "blog_entry_"+nextArticleIdentifier;
      var nextArticle = document.getElementById(nextArticleId);
      var nextArticleTop = getPos(nextArticle);

      if(scroll >= articleTop - 15 && scroll < nextArticleTop)
      {
        //Update Selected Article Identifier
        var blog_article_selected_id = "blog_article_selected_" + i;
        var blog_article_selected = document.getElementById(blog_article_selected_id);
        blog_article_selected.style.background = "#628196";
        
        currentArticle = i;

        //===================================================================================
        // MOVE ARCHIVE DOWN
        //===================================================================================
        if(currentArticle == topArchivePost + 8)
        {
          for(var i = topArchivePost-1; i < numBlogPosts; i++)
          {
            if(i >= topArchivePost-1)
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
            for(var i = topArchivePost; i < numBlogPosts; i++)
            {
              var blog_entry_scroll_id = "blog_entry_scroll_" + i;
              var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
              blog_entry_scroll.style.display = 'block';
            
            }
          }
          else 
          {
            for(var i = topArchivePost; i < topArchivePost + 10; i++)
            {
              var blog_entry_scroll_id = "blog_entry_scroll_" + i;
              var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
              blog_entry_scroll.style.display = 'block';
            }
          } 
        }
        //===================================================================================
        // END
        //===================================================================================






        //===================================================================================
        // MOVE ARCHIVE UP
        //===================================================================================
        if(currentArticle == topArchivePost-2)
        {
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
            for(var i = topArchivePost-2; i < topArchivePost+10; i++)
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

          for(var i = topArchivePost-1; i <  topArchivePost + 9; i++)
          {
            var blog_entry_scroll_id = "blog_entry_scroll_" + i;
            var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
            blog_entry_scroll.style.display = 'block';
          }
        }
        //===================================================================================
        // END
        //===================================================================================


       
        for(var j = i - 1; j >= startFromArticle; j--)
        {
          var blog_article_deselected_id = "blog_article_selected_" + j;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)";
        }

        for(var k = i + 1; k < numBlogPosts/*10*/; k++)
        {
          var blog_article_deselected_id = "blog_article_selected_" + k;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)";
        }
       
        var title = articleTitles[i-1];

        if(history.pushState) 
            history.pushState(null, null, 'blog.php#'+ title);
        else 
            location.hash = title;
      }
    }
}
  //===================================================================================
  // FILL SIDEBAR ON SCROLL
  //===================================================================================
  for (var i = count-1; i >= topArchivePost-1; i--)
  {
    // Get scroll section 
    var blog_entry_scroll_id = "blog_entry_scroll_" + i;
    var blog_entry_scroll = document.getElementById(blog_entry_scroll_id); 
    blog_entry_scroll.style.background = "rgba(129,129,129,0.3)";

    //Get position of next blog entry
    var next_blog_entry_id = "blog_entry_" + (i+1);
    var next_blog_entry = document.getElementById(next_blog_entry_id);
    var next_blog_entry_top = getPos(next_blog_entry);

    // Get position of blog entry  
    var blog_entry_id = "blog_entry_" + i;
    var blog_entry = document.getElementById(blog_entry_id);
    var blog_entry_top = getPos(blog_entry);
    var blog_entry_height = next_blog_entry_top - blog_entry_top;
  
archive_record_height = 75;
    // Fill correct percentage of current article
    if(scroll > blog_entry_top && scroll < next_blog_entry_top)
    {
      var relative_scroll = scroll - blog_entry_top;
      var percent_article_read = (relative_scroll / blog_entry_height);
      var archive_width = document.getElementById('blog_article_archive').clientWidth;
      
      var scroll_width = archive_width * percent_article_read;
      var scroll_height = archive_record_height * percent_article_read;
      

      blog_entry_scroll.style.height = scroll_height + "px";
      
    }

    //Fill all previous
    else if(scroll < next_blog_entry_top)
    {
      blog_entry_scroll.style.height = "0px";
    }

    //Empty all next
    else
    {
      blog_entry_scroll.style.height = archive_record_height+"px";
    }
}

  

  //===================================================================================
  // END
  //===================================================================================





    
  //===================================================================================
  // ADD NEW POST WHEN USER REACHES PAGE BOTTOM
  //===================================================================================
  var body = document.body, html = document.documentElement;
  height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  var h = window.innerHeight;
  var pageBottom = height - h;  
  
  if (scroll == pageBottom || scroll == pageBottom-1)
  {
    addArticle();
  }
  //===================================================================================
  // END
  //===================================================================================






































  //===================================================================================
  // END
  //===================================================================================
} 
window.onscroll = yHandler;



  //===================================================================================
  // HASH CHANGE
  //===================================================================================
  function locationHashChanged() 
  {   
    var hashLocation = window.location.hash;
    
    if(hashLocation.indexOf("_fullsize_image_") > -1)
    {
       var imageOverlay = document.getElementById("imageOverlay");
        imageOverlay.style.opacity = "0.9";
        imageOverlay.style.filter  = 'alpha(opacity=90)';
        imageOverlay.style.pointerEvents = "auto";
    }
    else
    {
       var imageOverlay = document.getElementById("imageOverlay");
        imageOverlay.style.opacity = "0";
        imageOverlay.style.filter  = 'alpha(opacity=0)';
        imageOverlay.style.pointerEvents = "none";  
    }
    
    if(hashLocation.indexOf("blog_entry_") > -1)
    {     
      var result = window.location.hash.split('blog_entry_');
      var hashArticleTitle = articleTitles[result[1]-1];

      if(history.pushState) 
        history.pushState(null, null, 'blog.php#'+ hashArticleTitle);
      else 
        location.hash = hashArticleTitle;
      
      window.location.reload(true);
    }
    else if(hashLocation.indexOf("_fullsize_image_") > -1 || hashLocation.indexOf("close") > -1)
    {

    }

    // HASH CHANGED TO AN ARTICLE TITLE 
    else
    { 
      var titleWithHash = hashLocation.split('#');
      var titleWithoutHash = titleWithHash[1];
      var recordLoaded = false;
      for (var i = 0; i < loadedArticles.length; i++) 
      {
        if(loadedArticles[i] == titleWithoutHash)
        {
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
  window.onhashchange = locationHashChanged;
  //===================================================================================
  // END
  //===================================================================================






  //===================================================================================
  // CLICK ON ARCHIVE                                                                  
  //===================================================================================
  function goToPost(postNum)
  {   
    //postNum+=1;
    location.hash = "#blog_entry_" + postNum;
  }
  //===================================================================================
  // END
  //===================================================================================






  //===================================================================================
  // UPDATE SELECTED ARTICLE ON HOME BUTTON PRESS (FIXED CHROME ISSUE)
  //===================================================================================
  function handleKeyPress(e) 
  {
    if (e.keyCode == 36) 
    {
        var blog_article_selected_id = "blog_article_selected_" + 0;
        var blog_article_selected = document.getElementById(blog_article_selected_id);
        blog_article_selected.style.background = "#628196";

        for (var i = count-1; i > 0; i--)
        {
          var blog_article_deselected_id = "blog_article_selected_" + i;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)"; 
        }
    }
  }
  window.addEventListener("keydown", handleKeyPress, false);
  //===================================================================================
  // END
  //===================================================================================