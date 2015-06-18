 window.addEventListener('load', getImages);
 window.addEventListener('load', getTheatre);
  
 window.addEventListener('resize', $.debounce(250, resizeImages));
 //$(window).resize( $.debounce(250, resizeImages) );
 
 
 var thumbnails=[];
 var images = [];
 var imageContainers = [];
 
 var theatre;
 var prev;
 var next;
 var innerTheatreContainer;
 var theatreImagesNodeList; //this is a node list not an array
 var theatreImagesHTML = [];
 var theatreImgContainer;
 var index=0;
 var single=false;
 

 
 /* getImages()
	 *
	 *	-Get all images that may need different classes (e.g. 'full-width', 'full-height') to cover their entire container
	 *	-Get the images' containers so their widths/heights can be compared
	 *
	 * -Add 'click' event listener to create the pop up theatre when clicked
	 *
	 *	-Those images have 'img' class applied to them for ease of selection. Do not remove this class from the HTML.
	 *	  If you choose to rename it, you have to rename it in JS and HTML
	 *
*/


function getImages()
{
	console.log("getting Images");
	
	postsNodeList = document.getElementsByClassName("blog-post");
	
	for(var i=0; i<postsNodeList.length; i++)
	{
		
		if(!postsNodeList[i].imgsRetrieved)
		{
			
			var tempNodelist = postsNodeList[i].querySelectorAll(".img");
			
			for (var j = 0; j < tempNodelist.length; j++) 
			{
				var selfImage = tempNodelist[j];
				images.push(selfImage);
				
				images[images.length-1].addEventListener('click', createTheatre);
				//get containers
				imageContainers[images.length-1] = images[images.length-1].parentElement;
			}
			
			postsNodeList[i].imgsRetrieved = true;
		}
		
	}
	
	resizeImages();
	
}

 /*(function getImages()
 {
	 console.log("getting Images");
	 imagesNodeList = document.querySelectorAll(".img");
	  
	//convert NodeList objects to arrays
	for (var i = 0; i < imagesNodeList.length; i++) 
	{
		var selfImage = imagesNodeList[i];
		images.push(selfImage);
		
		images[i].addEventListener('click', createTheatre);
		
		//get containers
		imageContainers[i] = images[i].parentElement;
	}
	
	//resize on load
	resizeImages();
 }
 
 
 function getNewImages()
 {
	 //var post = post;
	 //tempNodeList = post.querySelector(".img");
	 tempNodeList = $(".blog-post:last").find(".img"); //not necessarily only the last one 
	 
	 postsNodeList = document.getElementsByClassName("blog-post");
	 
	 
	// console.log(tempNodeList.length);
	 for (var i = 0; i < tempNodeList.length; i++) 
	{
		var selfImage = tempNodeList[i];
		images.push(selfImage);
		
		images[images.length-1].addEventListener('click', createTheatre);
		
		//get containers
		imageContainers[images.length-1] = images[images.length-1].parentElement;
	}
	
	resizeImages();
 }*/
 
 
 
 /* getTheatre()
	 *
	 *	-Get the pop up theatre elements so the script doesn't have to retrieve them every time the theatre is displayed
	 * -Add event listener to required elements
	 *
*/
 function getTheatre()
 {
	 theatre = document.getElementById("overlay-theatre");
	 prev = document.getElementById("previous-arrow");
	 next = document.getElementById("next-arrow");
	 exit = document.getElementById("exit");
	 
	 theatreImgContainer = document.getElementById("theatre-img-container");
	 imgDesc = document.getElementById("img-desc");
	 
	 innerTheatreContainer = document.getElementById("inner-theatre-container");
	 
	 theatre.addEventListener('click', hideTheatre, false);
	 exit.addEventListener('click', hideTheatre, false);
	 prev.addEventListener('click', changeImage);
	 next.addEventListener('click', changeImage);
	 
	 //window.addEventListener("keydown", keyFired);
	 window.addEventListener("keydown", changeImage);
	 
	 innerTheatreContainer.addEventListener('click', preventExit);
	 prev.forward = false;
	 next.forward = true;
 }
 
 
 
 
 
 
 /* createTheatre()
	 *
	 * -call other functions to: 1-get theatre images 2-create HTML code for theatre images
	 *	-displays the theatre containing the image that was clicked
	 *
*/ 
 function createTheatre(evt)
 {
	 console.log("creating theatre");
	 
	 single = false;
	 getTheatreImages(evt);
	 
	 if(theatreImagesHTML.length > 0) //check if not empty
	 {
		 theatreImagesHTML.splice(0,theatreImagesHTML.length); //clear array
	 }
	 
	 createTheatreImagesHTML(evt);
	 
	 //display clicked image in theatre - index assigned in createTheatreImagesHTML()
	 theatreImgContainer.innerHTML = theatreImagesHTML[index].html;
	 imgDesc.innerHTML = theatreImagesHTML[index].desc;
	 
	 arrowVisibility();
	 theatre.style.display = 'block';
	  
 }
 
 /* getTheatreImages()
	 *
	 * -Stores the images in a node list: 'theatreImagesNodeList'
	 * -If single image, node list will have one element at index 0
	 *
	 *	-If group of images, get the nth-level parent (of the image that was clicked (= evt.target)) that contains all the images of the group and then retrieve all the images inside it
	 * -The nth-level parent needed is between 1-3. If HTML structure is modified, this will need to be modified accordingly
	 * -The parent this function looks for has a class 'group-landscape' or 'group-portrait'
	 *
*/ 
 function getTheatreImages(evt)
 {
	 var directParent = evt.target.parentElement;
	 var secondLvlParent = directParent.parentElement;
	 var thirdLvlParent = secondLvlParent.parentElement;
	 
	 if(directParent.className.match(/(?:^|\s)group-landscape(?!\S)/) || directParent.className.match(/(?:^|\s)group-portrait(?!\S)/))
	 {
		 theatreImagesNodeList = directParent.getElementsByTagName("img");
	 }
	 
	 else if(secondLvlParent.className.match(/(?:^|\s)group-landscape(?!\S)/) || secondLvlParent.className.match(/(?:^|\s)group-portrait(?!\S)/))
	 {
		 theatreImagesNodeList = secondLvlParent.getElementsByTagName("img");
	 }
	 
	 else if(thirdLvlParent.className.match(/(?:^|\s)group-landscape(?!\S)/) || thirdLvlParent.className.match(/(?:^|\s)group-portrait(?!\S)/))
	 {
		 theatreImagesNodeList = thirdLvlParent.getElementsByTagName("img");
	 }
	 
	 else
	 {
		 single = true;
	 }
 }
 
 
 /* createTheatreImagesHTML()
	 *
	 * -creates HTML code for theatre images
	 * -assign the index of the clicked image in theatreImagesNodeList to index
	 *
*/ 
 function createTheatreImagesHTML(evt)
 {
	 if(!single)
	 {
		 console.log("group");
		for(var i=0; i<theatreImagesNodeList.length; i++)
		{
			 
			 theatreImagesHTML[i] = {html:"<img class=\"theatre-img center\" src=\""+theatreImagesNodeList[i].src+"\" />", desc: theatreImagesNodeList[i].alt };
			 
			 console.log(theatreImagesHTML[i].desc);
			 if(evt.target == theatreImagesNodeList[i]) //find out which one was clicked and save its index
			 {
				 index=i;
			 }
		 }
	 }
	 else
	 {
		 console.log("single");
		 
		 theatreImagesHTML[0] = {html:"<img class=\"theatre-img center\" src=\""+evt.target.src+"\" />", desc: evt.target.alt };
		 
		 index=0;
	 }
 }
 

/* changeImage()
	 *
	 * -changes the image when prev/next arrow is clicked
	 *	-prev and next have a boolean property called 'forward' set to false and true respectively. This is used to determine which arrow is clicked.
	 * -the theatreImagesHTML[] array is populated in createTheatre()
	 *
*/ 
 function changeImage(evt)
 {
	
	var keyFired = false;
	
	if(evt.keyCode)
	{
		console.log("key fired: " + evt.keyCode);
		keyFired = true;
	}
	
	//cases where the function was called because key down but nothing should be done
	if(theatre.style.display != "block" || (keyFired && evt.keyCode != '39' && evt.keyCode != '37')) 
	{
		//no need to keep executing the function
		return;
	}
	
	preventExit(evt);	
	
	//next
	//(next.forward=true && not last image && no keyboard keys pressed) || (right arrow key && not last image)
	if((evt.target.forward && index<theatreImagesHTML.length-1 && !keyFired) || (evt.keyCode == '39' && index<theatreImagesHTML.length-1))
	{
		console.log("NEXT");
		index++;
		theatreImgContainer.innerHTML = theatreImagesHTML[index].html;
		imgDesc.innerHTML = theatreImagesHTML[index].desc;
	}
	
	//prev
	//(prev.forward=false && not first image && no keyboard keys pressed) || (left arrow key && not first image)
	else if((!evt.target.forward && index>0 && !keyFired) || (evt.keyCode == '37' && index>0))
	{
		console.log("PREV");
		index--;
		theatreImgContainer.innerHTML = theatreImagesHTML[index].html;
		imgDesc.innerHTML = theatreImagesHTML[index].desc;
	}
	
	arrowVisibility();
 }
 
 
 
 /* preventExit()
	 *
	 *	in the script's context: 
	 * -hideTheatre() is executed when 'overlay-theatre' is clicked
	 *	-it prevents hideTheatre() from executing when a child of 'overlay-theatre' is clicked
	 * -for example, without preventExit() hideTheatre() will be executed when the arrows are clicked
	 *
	 *
	 * if you're unfamiliar with event order, refer to this: http://www.quirksmode.org/js/events_order.html
	 *
*/
 function preventExit(evt)
 {
	 console.log("prevent exit");
	 if (!evt) var evt = window.event;
	 evt.cancelBubble = true;
	 if (evt.stopPropagation) evt.stopPropagation();
 }
 
 
 function hideTheatre()
 {
	 theatre.style.display = 'none';
 }
 
 
 function arrowVisibility()
 {
	 prev.style.display = 'block';
	 next.style.display = 'block';
		 
	 if(single)
	 {
		 prev.style.display = 'none';
		 next.style.display = 'none';
	 }
	 else //group of images
	 {
		 if(index==0) //first
		 {
			prev.style.display = 'none';
		 }
	 
		if(index==theatreImagesHTML.length-1) //last
		{
			next.style.display = 'none';
		}
	 }
 }
 
 
 
 /* resizeImages()
	 *
	 * -Images retrieved using getImages()
	 * -Either 'full-width' or 'full-height' is applied to these images by default
	 *	-Compares images' widths/heights with their containers', and determines which class ('full-width' or 'full-height') is needed to cover the entire container
	 * -If 'full-width' is applied, compare heights only. If 'full-height' is applied, compare widths only
	 * -called on load and on resize (**and when a new post is added**)
	 *
*/
 function resizeImages()
 {
	 console.log("resizing images");
	 
	 for(var i=0; i<images.length; i++)
	 {
		 
		/*
		* 'full-width' is applied by default.
		*	on load, only the image's height and the container's height need to be compared
		*	on resize, if 'full-width' is applied, compare heights only. If 'full-height' is applied, compare widths only
		*
		*/
		
		//console.log("image height: " + images[i].clientHeight + " --- Container height: "+ imageContainers[i].clientHeight);
		
		//console.log("image width: " + images[i].clientWidth + " --- Container width: "+ imageContainers[i].clientWidth);
		
		if (images[i].className.match(/(?:^|\s)full-width(?!\S)/)) //'full-width' applied
		{
			if(images[i].clientHeight < imageContainers[i].clientHeight)
			{
				removeClass(images[i], 'full-width');
				addClass(images[i], 'full-height');
			}
		}
		
		else if (images[i].className.match(/(?:^|\s)full-height(?!\S)/)) //'full-height' applied
		{
			if(images[i].clientWidth < imageContainers[i].clientWidth)
			{
				removeClass(images[i], 'full-height');
				addClass(images[i], 'full-width');
			}
		}
	 }
	 
 }
 
