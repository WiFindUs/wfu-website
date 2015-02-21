//=====================GLOBAL VARIABLES========================

//=========================
var container;
//=========================

//==========SPEED==========
// speed must be a factor of 100
var interval = 10;
var fastInterval = 25;
var speed = interval; 
var frameRate = 24;
//=========================

//=====MOUSE CONTROLS======
var isClicked = false;
var lastY = -1;
var lastX = -1;
//=========================

//==========SLIDES=========
var slideContainers = [];		//contains slide's contents (image, text, etc)
var slideImages = [];
var slideCoord = [];
var selectorBtn = [];

var numSlides;
var currentSlide =0;
var targetSlide = 0;
var pauseCount = 0;

var paused = true;
var stopTest = false;
var previousSlide = false;
var slideMoving = false;
//=========================


//=============================================================



//==========================INITIALISE============================
window.onload = function()
{
	initialise();
}

function initialise()
{
	container = document.getElementById("slides");	
	getSlides();
	numSlides = slideImages.length;
	
	//'coverContainer' used as fall back when javascript not support or disabled
	for(var i=0; i<numSlides; i++)
	{
		removeClass(slideImages[i], 'coverContainer');
	}
	
	resizeSlide();
	
	if(numSlides > 1)
	{
		positionSlides();

		createSelectorBtns(numSlides);
		selectorBtn[0].src = "images/slideshow-button_selected.png";

		currentSlide = 0;
		
		update();
		draw();
		clock();	
	}
	document.getElementById("loader").style.display = 'none';
}
//=============================================================


//=============CREATE SLIDES & CONTENT================
function getSlides()
{
	//NodeList objects
	if(document.getElementsByClassName)
	{
		containersNodeList = document.getElementsByClassName("slideContainer");
		imagesNodeList = document.getElementsByClassName("slideImage");
	}
	else //IE8
	{
		containersNodeList = document.querySelectorAll(".slideContainer");
		imagesNodeList = document.querySelectorAll(".slideImage");
	}
	
	//convert NodeList objects to arrays
	for (var i = 0; i < containersNodeList.length; i++) 
	{
		var selfContainer = containersNodeList[i];
		var selfImage = imagesNodeList[i];
		
		slideContainers.push(selfContainer);
		slideImages.push(selfImage);
	}
}

function positionSlides()
{
	for(var i=0; i<slideContainers.length; i++)
	{
		var coord = i * 100;
		slideContainers[i].style.left = coord+"%";	//position the container to the right of the previous container (off screen)
		slideCoord[i] = coord;
	}
}

function showSlides()
{
	toggle(document.getElementById('loading'), 'hide');
	toggle(document.getElementById('slides'), 'show');
}

function createSelectorBtns(numSlides)
{
	//Add the correct number of selector buttons to <div id="selectorBtns">
	var content="<ul>";
	for(var i=0; i<numSlides; i++)
	{
		var inputID = "slideSelector"+i;
		content += "<li> <input id=\"" +inputID+ "\" type=\"image\" src=\"images/slideshow-button.png\" ontouchstart=\"goToSlide(" +i+ ")\" onclick=\"goToSlide(" +i+ ")\"></li> "
		//<li> <input id="slideSelector1" type="image" src="images/slideshow-button.png" onclick=goToSlide(1)> </li>
	}
	content += "</ul>";
	
	
	document.getElementById('selectorBtns').innerHTML = content;
	
	
	for(var i=0; i<numSlides; i++)
	{
		var inputID = "slideSelector"+i;
		selectorBtn[i] = document.getElementById(inputID);
	}
}
//=============================================================


//==========================UPDATE=============================
function update()
{
	if(paused == false && previousSlide == false)
	{
		move('left');
	}
	
	if(paused == false && previousSlide == true)
	{
		move('right');
	}
	
	setTimeout(update, 1000/frameRate);
}


//draw() updates slides positions using the calculated slideCoord[i]
function draw()
{	
	for(var i = 0; i < numSlides; i++)
	{
		slideContainers[i].style.left = slideCoord[i] + '%';
	}	
	
	setTimeout(draw, 1000/frameRate);
}



//clock() counts slide pause intervals
function clock()
{
	setInterval(function()
	{
		if(paused==true)
		{
			pauseCount++;
		}
		if(pauseCount == 5 && paused==true)
		{
			if(previousSlide == false)
			{
				nextSlide('left');
			}
			paused = false;
		}
	},1000);
}

//=============================================================


//===================MOVE SLIDES===================
/*
*	move(direction): 
*	1-updates slideCoord[i] based on direction
*	2-stops updating slideCoord[i] when the target slide is reached, setting paused=true
*	3-starts updating slideCoord[i] again when clock() sets paused=false
*/

function move(direction)
{
	slideMoving = true;
	stopTest = false
	
	if(stopTest == false)
	{
		if(direction=='left')
		{
			for(var i=0; i < numSlides; i++)
			{
				slideCoord[i] -= speed;
			}
		}
		else if(direction=='right')
		{
			for(var i=0; i < numSlides; i++)
			{
				slideCoord[i] += speed;
			}
		}
			
		if(slideCoord[targetSlide] == 0 && paused == false)
		{
			stopTest = true;
			paused = true;
			slideMoving = false;
			currentSlide= targetSlide;
			previousSlide = false;	//only move backward when selector button clicked; move forward by default
			updateSelectorBtns();
		}
			
	}	
	
}

function updateSelectorBtns()
{
	for(var i = 0; i<numSlides; i++)
	{
		if(i == targetSlide)
			selectorBtn[i].src = "images/slideshow-button_selected.png";
		else
			selectorBtn[i].src = "images/slideshow-button.png";
	}
}
//=============================================================



//=================DETERMINE SLIDE TO GO TO=======================

//goToSlide() called when a selector button is clicked/touched 
function goToSlide(slide)
{
	if(!slideMoving)
	{
		targetSlide = slide;
		
		if(targetSlide < currentSlide)
		{
			nextSlide('right');
		}
		else if(targetSlide > currentSlide)
		{
			nextSlide('left');
		}
	}
}


//direction = direction slides move (e.g. next: slides moves to the left)
function nextSlide(direction)
{
	if(direction=='left')
	{
		previousSlide = false;
		
		//if true, last slide reached; go back to first
		if(currentSlide == (numSlides-1))
		{
			previousSlide = true;
			targetSlide = 0;
		}
		
		else if(targetSlide == currentSlide)
		{
			//if true, targetSlide was not updated by another function; needs to be incremented to target the next slide
			targetSlide++;
		}
	}
	
	if(direction == 'right')
	{
		previousSlide = true;
		//targetSlide either updated by goToSlide() or above when last slide reached
	}
	
	slideSpeed();
	
	paused = false;
	pauseCount = 0;
}


function slideSpeed()
{	
	if(targetSlide != currentSlide+1 && targetSlide != currentSlide-1)
	{
		speed= fastInterval;
	}
	else
	{
		speed = interval;
	}
}
//=============================================================




window.addEventListener('resize', resizeCheck);

function resizeCheck()
{
	clearStyle(); //keep for menu.js
	resizeSlide();
}


/*
* resizeSlide() is called when the browser window once when the all the slides have been loaded (see draw())
* when the browser window is resized to ensure that each image is covering the whole container in the most
* desirable way.
*
* The function:
* 1-checks whether the current width of each slide is less than the width of the window (& hence the container*)
* If so, it adds the CSS class "fullWidth" (defined in CSS) to the image by appending it to its className
* result: <img src="slide/slide(i).jpg" class="slideImage fullWidth"/>
*
* 2-checks whether the current height of each slide is less than the height of the container
* If so, it removes the CSS class "fullWidth" by overwriting the className to slideImage
* result: <img src="slide/slide(i).jpg" class="slideImage"/>
*
*/


function resizeSlide()
{
	for(var i=0; i<numSlides; i++)
	{
		if(slideImages[i].clientWidth < container.clientWidth)
		{
			//check whether fullWidth is already applied
			if (!slideImages[i].className.match(/(?:^|\s)fullWidth(?!\S)/) )
			{
				addClass(slideImages[i], 'fullWidth');
			}
		}
		
		if(slideImages[i].clientHeight < container.clientHeight)
		{
			removeClass(slideImages[i], 'fullWidth');
		}
	}
}


function removeClass(element, cssClass)
{
	/* regExp: /(?:^|\s)MyClass(?!\S)/g
	*
	*	(?:^|\s)	match the start of the string, or any single whitespace character
	*	MyClass 	classname to remove
	*
	*	(?!\S)		negative lookahead to verify the above is the whole classname
	*					ensures there is no non-space character following
	*					i.e. must be end of string or a space
	*
	*	/g				perform a global match (find all matches rather than stopping after the first match)
	*					in case a class was unintentionally added multiple times
	*/
	
	var removeClass = '(?:^|\\s)'+cssClass+'(?!\\S)';
	var reg = new RegExp(removeClass, 'g');
	
	element.className = element.className.replace(reg, '');
}

function addClass(element, cssClass)
{
	element.className += " " + cssClass;
}


function toggle(element, visibility)
{
	if(visibility == "hide")
	{
		element.style.visibility = 'hidden';
	}
	if(visibility == "show")
	{
		element.style.visibility = 'visible';
	}
}


function isVisible(element)
{
	if(element.style.visibility == "visible")
	{
		return true;
	}
	
	else
	{
		return false;
	}

}

function isPropertySupported(property)
{
	return property in document.documentElement.style;
}