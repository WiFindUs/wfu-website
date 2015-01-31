//=====================GLOBAL VARIABLES========================

//=========================
var container;
var sizeCheckedOnLoad = false;
//=========================

//==========SPEED==========
var speed = 60; 
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
var slideShowImages = [];
var slideShowImageCoordinates = [];
var numSlides = 4;
var slideMoving = false;
var currentSlide;
var paused = true;
var pauseCount = 0;
var previousSlide = false;
var numSlidesToAdd;
var stopOnSlide = -1;
var stopTest = false;
var slideSelectionButtons = [];

//=========================


//=============================================================



//==========================ONLOAD=============================
window.onload = function()
{
	hud = document.getElementById("hud");
	
	


	initialise();
}
//=============================================================



//==========================UPDATE============================
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
	
	for(var i=numSlides-1; i>-1; i--)
	{
		createSlideImage(i);
	}
	/*createSlideImage(3);
	createSlideImage(2);
	createSlideImage(1);
	createSlideImage(0);*/

	createSelectorBtns(numSlides);
	slideSelectionButtons[0].src = "images/slideshow-button_selected.png";

	toggle(slideShowImages[0], "show");
	slideShowImageCoordinates[0] = 0;
	currentSlide = 0;
	
	update();
	draw();
	clock();
}
//=============================================================



//==========================UPDATE=============================
function update()
{
	if(paused == false && previousSlide == false)
	{
		for(var i=0; i<numSlides; i++)
		{
			moveLeft(i);
		}
		/*moveLeft(0);
		moveLeft(1);
		moveLeft(2);
		moveLeft(3);*/
	}
	if(paused == false && previousSlide == true)
	{
		for(var i=numSlides-1; i>-1; i--)
		{
			moveRight(i);
		}
		/*moveRight(3);
		moveRight(2);
		moveRight(1);
		moveRight(0);*/
	}
	setTimeout(update, 1000/frameRate);
}
//=============================================================



//===================MOVE SLIDES TO THE LEFT===================
function moveLeft(slide)
{
	slideMoving = true;
	stopTest = false
	
	for(var i = 0; i <= speed; i++)
	{
		if(stopTest == false)
		{
			slideShowImageCoordinates[slide] -= 1;	
			if(slideShowImageCoordinates[slide] == 0 && paused == false)
			{
				if(stopOnSlide == slide || stopOnSlide == -1)
				{
					if(stopOnSlide == slide)
					{
						stopOnSlide = -1;
					}
					
					stopTest = true;
					paused = true;
					slideMoving = false;
					hideSlides();
				}
				else
				{
					nextSlide();	
				}
			}
		}	
	}
}	
//=============================================================



//===================MOVE SLIDES TO THE RIGHT===================
function moveRight(slide)
{
	slideMoving = true;
	stopTest = false
	
	for(var i = 0; i <= speed; i++)
	{
		if(stopTest == false)
		{
			slideShowImageCoordinates[slide] += 1;	
			if(slideShowImageCoordinates[slide] == 0 && paused == false)
			{
				previousSlide = false;
				if(stopOnSlide == slide || stopOnSlide == -1)
				{
					if(stopOnSlide == slide)
					{
						stopOnSlide = -1;
					}
					
					stopTest = true;
					paused = true;
					slideMoving = false;
					hideSlides();
				}
				else
				{
					prevSlide();
				}
			}
		}	
	}
}	
//=============================================================



//==================ADD SINGLE SLIDE==================
function addSlideRight(newSlidePos)
{
	slideShowImageCoordinates[newSlidePos] = 100;
}

function addSlideLeft(newSlidePos)
{
	slideShowImageCoordinates[newSlidePos] = -100;
}
//=============================================================



//================ADD MULTIPLE SLIDES=================
function addMultipleSlidesRight(nextSlidePos, numSlides)
{
	var positionMultiplier = 1;
	for(var i = nextSlidePos; i < nextSlidePos+numSlides; i++)
	{
		slideShowImageCoordinates[i] = 100*positionMultiplier;
		positionMultiplier++;
	}
	stopOnSlide = (nextSlidePos+numSlides)-1;
}

function addMultipleSlidesLeft(nextSlidePos, numSlides)
{

	var positionMultiplier = 1;
	for(var i = currentSlide+1; i > nextSlidePos; i--)
	{
		var multiplier = i-1;
		slideShowImageCoordinates[multiplier] = -100*positionMultiplier;
		positionMultiplier++;
	}
	stopOnSlide = nextSlidePos;
}

//=============================================================

//=============CREATE SLIDES & CONTENT================
function createSlideImage(newSlidePos)
{
	var slide;
	var filePos = newSlidePos+1;
	slide = document.createElement('img');
	slide.src = "slides/slide"+ filePos +".jpg";
	
	slide.className = "slideImage";
	container.appendChild(slide);
	slideShowImages[newSlidePos] = slide;
}

function createSelectorBtns(numSlides)
{
	
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
		slideSelectionButtons[i] = document.getElementById(inputID);
	}
}
//=============================================================



//=================SELECT SLIDE TO GO TO=======================
function goToSlide(slide)
{
	if(slide == currentSlide-1)
	{
		prevSlide();
	}
	else if(slide == currentSlide+1)
	{
		nextSlide();
	}
	else if(slide < currentSlide)
	{
		prevSlide();
		numSlidesToAdd = (currentSlide + 1)  -  slide;
		addMultipleSlidesLeft(slide, numSlidesToAdd);
	}
	else if(slide > currentSlide)
	{
		nextSlide();
		numSlidesToAdd = slide - currentSlide + 1;
		addMultipleSlidesRight(currentSlide, numSlidesToAdd);
	}
}
//=============================================================



//==================GO TO NEXT SLIDE===========================
function nextSlide()
{
	previousSlide = false;
	if(currentSlide == (numSlides-1))
	{
		currentSlide = -1;
		//slideVisibility(numSlides-1, currentSlide + 1);
	}
	else
	{
		//slideVisibility(currentSlide, currentSlide + 1);
	}
	
	for(var i = 0; i<numSlides; i++)
	{
		if(i == currentSlide+1)
			slideSelectionButtons[i].src = "images/slideshow-button_selected.png";
		else
			slideSelectionButtons[i].src = "images/slideshow-button.png";
	}

	currentSlide += 1;
	showSlides();
	addSlideRight(currentSlide);
	paused = false;
	pauseCount = 0;
}
//=============================================================



//====================GO TO PREVIOUS SLIDE====================
function prevSlide()
{
	previousSlide = true;
	currentSlide -= 1;
	
	if(currentSlide == -1)
	{
		currentSlide = numSlides-1;
		//slideVisibility(currentSlide, 0);
	}	
	else
	{
		var test  = currentSlide+1;
		//slideVisibility(currentSlide, test);
	}

	for(var i = 0; i<numSlides; i++)
	{
		if(i == currentSlide)
			slideSelectionButtons[i].src = "images/slideshow-button_selected.png";
		else
			slideSelectionButtons[i].src = "images/slideshow-button.png";
	}

	showSlides();
	addSlideLeft(currentSlide);
	paused = false;
	pauseCount = 0;
}
//=============================================================



//==========DISPLAY ONLY THE CURRENTLY VISIBLE SLIDES========== 
function slideVisibility(slide1, slide2)
{
	if(currentSlide == numSlides-1)
	{
		slide2 = 0;
	}
	toggle(slideShowImages[slide1], "show");
	toggle(slideShowImages[slide2], "show");
	
	for(var i = numSlides-1; i >= 0; i--)
	{
		if(i != slide1 && i != slide2)
		{
			toggle(slideShowImages[i], "hide");
		}
	}
}

function showSlides()
{
	for(var i = numSlides-1; i >= 0; i--)
	{
		toggle(slideShowImages[i], "show");
	}
}

function hideSlides()
{
	for(var i = numSlides-1; i >= 0; i--)
	{
		if(i != currentSlide)
		{
			toggle(slideShowImages[i], "hide");
		}
	}
}
//=============================================================



//=================COUNT SLIDE PAUSE INTERVALS=================
function clock()
{
	setInterval(function()
	{
		if(paused==true)
			pauseCount++;

		if(pauseCount == 5 && paused==true)
		{
			if(previousSlide == false)
				nextSlide();
			
			paused = false;
		}
	},1000);
}
//=============================================================



//==========================DRAW=============================== 
function draw()
{
	if(!sizeCheckedOnLoad && slideShowImages[numSlides-1].clientWidth != 0)
	{
		resizeSlide();
		sizeCheckedOnLoad = true;
	}
	
	toggle(hud, "show");
	for(var i = 1; i < numSlides+1; i++)
	{
		var pos = i-1;
		slideShowImages[pos].style.left = slideShowImageCoordinates[pos] + '%';
	}	
	setTimeout(draw, 1000/frameRate);
}
//=============================================================


window.addEventListener('resize', resizeCheck);

function resizeCheck()
{
	clearStyle();
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
		if(slideShowImages[i].clientWidth < window.innerWidth)
		{
			/* //debug
			console.log("image width("+i+"): " + slideShowImages[i].clientWidth);
			console.log("image height("+i+"): " + slideShowImages[i].clientHeight);
			console.log("container height: " + document.getElementById('slideshowContainer').clientHeight);
			console.log("window width: " + window.innerWidth);*/
			
			//check whether ensureWidth is already applied
			if (!slideShowImages[i].className.match(/(?:^|\s)ensureWidth(?!\S)/) )
			{
				//space before ensureWidth is important
				slideShowImages[i].className += " ensureWidth";
			}
		}
		
		if(slideShowImages[i].clientHeight < document.getElementById('slideshow').clientHeight)
		{
			slideShowImages[i].className = "slideImage";
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
