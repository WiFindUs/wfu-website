

var height;
var numBlogPosts = 0;

function addArchive()
{
  numBlogPosts++;
}


window.onload = function() 
{
  function getScrollTop() 
  {
    if (typeof window.pageYOffset !== 'undefined' ) 
    {
      return window.pageYOffset + (height * 0.011);
    }

    var d = document.documentElement;
    if (d.clientHeight) 
    {
      return d.scrollTop + 200;
    }
    return document.body.scrollTop;
  }

  function getPos(el) 
  {
      for (var lx=0, ly=0;
           el != null;
           lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
      return ly;
  }

    
  window.onscroll = function() 
  {
    var body = document.body, html = document.documentElement;
    height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    var scroll = getScrollTop();
    var box = document.getElementById('blog_archive');
    var footerHeight = document.getElementById('friends').clientHeight;
    var clientHeight = document.getElementById('blog_archive').clientHeight;
    var stopScroll = height - (footerHeight+clientHeight);

    if(scroll < stopScroll)
    {
      if (scroll <= 297) 
      {
        box.style.top = "297px";
      }
      else
        box.style.top = (scroll + 1) + "px";
    }
    else
    {
      box.style.top = (stopScroll-20)+"px";
    }

    for (var i = numBlogPosts-1; i >= 0; i--)
    {
      var blog_entry_id = "blog_entry_" + i;
      var next_blog_entry_id = "blog_entry_" + (i+1);
      var blog_article_selected_id = "blog_article_selected_" + i;
      var blog_entry_scroll_id = "blog_entry_scroll_" + i;

      var next_blog_entry = document.getElementById(next_blog_entry_id);
      var next_blog_entry_pos = getPos(next_blog_entry);

      var blog_entry = document.getElementById(blog_entry_id);
      var blog_entry_height = document.getElementById(blog_entry_id).clientHeight;

      var blog_article_archive_height = document.getElementById('blog_article_archive').clientHeight;
      var blog_entry_pos = getPos(blog_entry);


      var blog_entry_bottom = blog_entry_pos + blog_entry_height;
      var articleNum = 0;

      var blog_article_selected = document.getElementById(blog_article_selected_id);
      
      var blog_entry_scroll = document.getElementById(blog_entry_scroll_id);
      
      blog_entry_scroll.style.background = "rgba(129,129,129,0.3)";
        
      var break_height = document.getElementById('blog_break').clientHeight; 

      if(scroll > blog_entry_pos && scroll < (next_blog_entry_pos) )
      {
        for(var j = i - 1; j >= 0; j--)
        {
          var blog_article_deselected_id = "blog_article_selected_" + j;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)";
        }

        for(var k = i + 1; k < numBlogPosts; k++)
        {
          var blog_article_deselected_id = "blog_article_selected_" + k;
          var blog_article_deselected = document.getElementById(blog_article_deselected_id);
          blog_article_deselected.style.background = "rgba(0,0,0,0)";
        }

        blog_article_selected.style.background = "#628196";

        var relative_scroll = scroll - blog_entry_pos;
        var relative_article_bottom = blog_entry_bottom -blog_entry_pos;

        var percent_article_read = (relative_scroll / relative_article_bottom);
        
        var read_height = percent_article_read * (blog_article_archive_height) ;
        var scroll_percentage = read_height + blog_article_archive_height*i

        if(percent_article_read <= 1)
        {
          blog_entry_scroll.style.height = scroll_percentage + "px";
        }
        else
        {
          blog_entry_scroll.style.height = (blog_article_archive_height * (i+1)) + "px";
        }
      }
      else
      {
        blog_entry_scroll.style.height = "0px";
      }
    }
  };
};