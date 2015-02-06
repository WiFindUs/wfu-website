//=====================GLOBAL VARIABLES========================

//=========================
var container;
var sizeCheckedOnLoad = false;
//=========================

//==========SPEED==========
var speed = 50; 
var frameRate = 24;
//=========================

//=====MOUSE CONTROLS======
var isClicked = false;
var lastY = -1;
var lastX = -1;
//=========================

//======HTML Elements======
var hud;
var slideSelector1;
var slideSelector2;
var slideSelector3;
var slideSelector4;
//==================

//==========SLIDES=========
var slideContainer = [];		//contains slide's contents (image, text, etc)
var slideImages = [];
var slideCoord = [];
var selectorBtn = [];

var numSlides = 4;
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
	hud = document.getElementById("hud");
	
	initialise();
}



function initialise()
{
	container = document.getElementById("slides");
	container.innerHTML = ""; 

	listenForEvent(window, "mousedown", handleClick); 
	listenForEvent(window, "touchstart", handleClick);
	listenForEvent(window, "touchend", handleRelease);
	listenForEvent(window, "mouseup", handleRelease);
	listenForEvent(window, "touchmove", handleSwipe);
	listenForEvent(window, "mousemove", handleMouse);
	listenForEvent(container, 'contextmenu', function(e){e.preventDefault();});
		
	for(var i=0; i<numSlides; i++)
	{
		createSlide(i);
	}

	createSelectorBtns(numSlides);
	selectorBtn[0].src = "images/slideshow-button_selected.png";

	slideCoord[0] = 0;
	currentSlide = 0;
	
	update();
	draw();
	clock();
}
//=============================================================


//=============CREATE SLIDES & CONTENT================
function createSlide(slidePos)
{
	var slide;
	var slideImage;
	var filePos = slidePos+1;
	
	slide = document.createElement('div');
	slide.className = "slideContainer";
	var coord = slidePos * 100;
	slide.style.left = coord+"%";	//position the container to the right of the previous container (off screen)
	slideCoord[slidePos] = coord;
	container.appendChild(slide);
	
	slideImage = document.createElement('img');
	slideImage.src = "images/slides/slide"+ filePos +".jpg";
	slideImage.className = "slideImage";
	slide.appendChild(slideImage);
	
	slideContainer[slidePos] = slide;
	slideImages[slidePos] = slideImage;
	
}

function createSelectorBtns(numSlides)
{
	//Add the correct number of selector buttons to <div id="slideshowBtns">
	
	var content="<ul>";
	for(var i=0; i<numSlides; i++)
	{
		var j = i+1;
		var inputID = "slideSelector"+j;
		content += "<li> <input id=\"" +inputID+ "\" type=\"image\" src=\"images/slideshow-button.png\" ontouchstart=\"goToSlide(" +i+ ")\" onclick=\"goToSlide(" +i+ ")\"></li> "
	}
	content += "</ul>";
	
	
	document.getElementById('slideshowBtns').innerHTML = content;
	
	
	for(var i=0; i<numSlides; i++)
	{
		var j = i+1;
		var inputID = "slideSelector"+j;
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
	//resize the slides when they're loaded
	if(!sizeCheckedOnLoad && slideImages[numSlides-1].clientWidth != 0) //all slides finished loading
	{
		resizeSlide();
		sizeCheckedOnLoad = true;
	}
	else if(!sizeCheckedOnLoad && slideImages[0].clientWidth != 0)	//at least first slide finished loading
	{
		resizeSlide();
	}
	
	for(var i = 0; i < numSlides; i++)
	{
		slideContainer[i].style.left = slideCoord[i] + '%';
	}	
	
	setTimeout(draw, 1000/frameRate);
}



//clock() counts slide pause intervals
function clock()
{
	setInterval(function()
	{
		if(paused==true)
			pauseCount++;

		if(pauseCount == 5 && paused==true)
		{
			if(previousSlide == false)
				nextSlide('left');
			
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
	
	paused = false;
	pauseCount = 0;
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
* If so, it adds the CSS class "ensureWidth" (defined in CSS) to the image by appending it to its className
* result: <img src="slide/slide(i).jpg" class="slideImage ensureWidth"/>
*
* 2-checks whether the current height of each slide is less than the height of the container
* If so, it removes the CSS class "ensureWidth" by overwriting the className to slideImage
* result: <img src="slide/slide(i).jpg" class="slideImage"/>
*
* Note: this only works if only 2 classes ("slideImage" and ensureWidth) are applied. 
* To make this future proof (what if we apply more classes?), you should remove the "ensureWidth" only from
* the className; replace it with "" using regEx and replace()
*/


function resizeSlide()
{
	for(var i=0; i<numSlides; i++)
	{
		/*console.log("image width("+i+"): "  + slideImages[i].clientWidth);
		console.log("image height("+i+"): "  + slideImages[i].clientHeight);*/
		
		if(slideImages[i].clientWidth < window.innerWidth)
		{
			//check whether ensureWidth is already applied
			if (!slideImages[i].className.match(/(?:^|\s)ensureWidth(?!\S)/) )
			{
				//space before ensureWidth is important
				slideImages[i].className += " ensureWidth";
			}
		}
		
		if(slideImages[i].clientHeight < document.getElementById('slideshow').clientHeight)
		{
			slideImages[i].className = "slideImage";
		}
	}
}



/* ============ CONTROLS FUNCTIONS  ============*/

function handleClick(event)
{
	event.preventDefault();

		isClicked = true;
}


function handleRelease(e)
{
	isClicked = false;
	lastY=-1;
	lastX=-1;
}


function handleSwipe(event)
{

	event.preventDefault();		

	var currentY = event.touches[(event.touches.length-1)].clientY;
	var difference;
	if (lastY < 0)
	{
		lastY = currentY;
    }

	if(lastY < currentY || lastY > currentY)
	{
		difference = lastY - currentY;
	

	}
	
	lastY = currentY;
}


function handleMouse(event)
{
	event.preventDefault();	
	if(isClicked==true)
	{
		var event = event || window.event;
		var currentY = event.clientY;
		var difference;
		if (lastY < 0)
		{
			lastY = currentY;
		}

		if(lastY < currentY || lastY > currentY)
		{

		}
			
		lastY = currentY;

		var currentX = event.clientX;
		var difference;
		if (lastX < 0)
		{
			lastX = currentX;
		}

		if(lastX < currentX || lastX > currentX)
		{
			

		}
			
		lastX = currentX;		
	}
}


/* ============  END OF CONTROLS FUNCTIONS ============*/



/* ============ VISIBILITY FUNCTIONS  ============*/

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


var listenForEvent = function (element, event, callback) {
    //Regular style
		if (element.addEventListener) {
        element.addEventListener(event, callback, false);
    }else 
		//IE Style
		if (element.attachEvent) {
        element.attachEvent('on' + event, callback);
    } 
		//Legacy IE Style
		else {
        element['on' + event] = callback;
    }
};
