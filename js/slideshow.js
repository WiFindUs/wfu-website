//=====================GLOBAL VARIABLES========================

//========CONTAINER========
var container;

//var containerWidth = 1920; 
//var containerHeight = 1080;

var containerWidth = 100; 
var containerHeight = "auto";
 
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
var numberOfSlides = 4;
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
	
	slideSelector1 = document.getElementById("slideSelector1");
 	slideSelector2 = document.getElementById("slideSelector2");
 	slideSelector3 = document.getElementById("slideSelector3");
	slideSelector4 = document.getElementById("slideSelector4");

	initialise();
}
//=============================================================



//==========================UPDATE============================
function initialise()
{
	container = document.getElementById("slideshow");
	container.innerHTML = ""; 
	/*container.style.width = containerWidth + 'px';
	container.style.height = containerHeight + 'px';*/

	listenForEvent(window, "mousedown", handleClick); 
	listenForEvent(window, "touchstart", handleClick);
	listenForEvent(window, "touchend", handleRelease);
	listenForEvent(window, "mouseup", handleRelease);
	listenForEvent(window, "touchmove", handleSwipe);
	listenForEvent(window, "mousemove", handleMouse);
	listenForEvent(container, 'contextmenu', function(e){e.preventDefault();});
	
	createSlideImage(3);
	createSlideImage(2);
	createSlideImage(1);
	createSlideImage(0);

	slideSelectionButtons[0] = slideSelector1;
	slideSelectionButtons[1] = slideSelector2;
	slideSelectionButtons[2] = slideSelector3;
	slideSelectionButtons[3] = slideSelector4;

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
		moveLeft(0);
		moveLeft(1);
		moveLeft(2);
		moveLeft(3);
	}
	if(paused == false && previousSlide == true)
	{
		moveRight(3);
		moveRight(2);
		moveRight(1);
		moveRight(0);		
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
						stopOnSlide = -1;
					stopTest = true;
					paused = true;
					slideMoving = false;
				}
				else
					nextSlide();	
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
						stopOnSlide = -1;
					stopTest = true;
					paused = true;
					slideMoving = false;
				}
				else
					prevSlide();	
			}
		}	
	}
}	
//=============================================================



//==================ADD SINGLE SLIDE ON RIGHT==================
function addSlideRight(newSlidePos)
{
	//slideShowImageCoordinates[newSlidePos] = containerWidth;
	slideShowImageCoordinates[newSlidePos] = 100;
}
//=============================================================



//================ADD MULTIPLE SLIDES ON RIGHT=================
function addMultipleSlidesRight(nextSlidePos, numSlides)
{
	var positionMultiplier = 1;
	for(var i = nextSlidePos; i < nextSlidePos+numSlides; i++)
	{
		//slideShowImageCoordinates[i] = containerWidth*positionMultiplier;
		slideShowImageCoordinates[i] = 100*positionMultiplier;
		positionMultiplier++;
	}
	stopOnSlide = (nextSlidePos+numSlides)-1;
}
//=============================================================



//==================ADD SINGLE SLIDE ON LEFT===================
function addSlideLeft(newSlidePos)
{
	//slideShowImageCoordinates[newSlidePos] = -containerWidth;
	slideShowImageCoordinates[newSlidePos] = -100;
}
//=============================================================



//================ADD MULTIPLE SLIDES ON LEFT==================
function addMultipleSlidesLeft(nextSlidePos, numSlides)
{

	var positionMultiplier = 1;
	for(var i = currentSlide+1; i > nextSlidePos; i--)
	{
		var multiplier = i-1;
		//slideShowImageCoordinates[multiplier] = -containerWidth*positionMultiplier;
		slideShowImageCoordinates[multiplier] = -100*positionMultiplier;
		positionMultiplier++;
	}
	stopOnSlide = nextSlidePos;
}
//=============================================================



//=============CREATE AND ADD EACH SLIDE IMAGE================
function createSlideImage(newSlidePos)
{
	var slide;
	var filePos = newSlidePos+1;
	slide = document.createElement('img');
	slide.src = "slides/slide"+ filePos +".jpg";
	slide.className = "slideImage";
	/*slide.style.width = containerWidth +"px";
	slide.style.height = containerHeight +"px";*/
	container.appendChild(slide);
	slideShowImages[newSlidePos] = slide;
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
		addMultipleSlidesLeft(slide, numSlidesToAdd)
	}
	else if(slide > currentSlide)
	{
		nextSlide();
		numSlidesToAdd = slide - currentSlide + 1;
		addMultipleSlidesRight(currentSlide, numSlidesToAdd)
	}
}
//=============================================================



//==================GO TO NEXT SLIDE===========================
function nextSlide()
{
	previousSlide = false;
	if(currentSlide == 3)
	{
		currentSlide = -1;
		slideVisibility(numberOfSlides-1, currentSlide + 1);
	}
	else	
		slideVisibility(currentSlide, currentSlide + 1);
	
	for(var i = 0; i<numberOfSlides; i++)
	{
		if(i == currentSlide+1)
			slideSelectionButtons[i].src = "images/slideshow-button_selected.png";
		else
			slideSelectionButtons[i].src = "images/slideshow-button.png";
	}

	addSlideRight(currentSlide += 1);
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
		currentSlide = 3;
		slideVisibility(currentSlide, 0)
	}	
	else
	{
		var test  = currentSlide+1;	
		slideVisibility(currentSlide, test)
	}

	for(var i = 0; i<numberOfSlides; i++)
	{
		if(i == currentSlide)
			slideSelectionButtons[i].src = "images/slideshow-button_selected.png";
		else
			slideSelectionButtons[i].src = "images/slideshow-button.png";
	}

	addSlideLeft(currentSlide);
	paused = false;
	pauseCount = 0;
}
//=============================================================



//==========DISPLAY ONLY THE CURRENTLY VISIBLE SLIDES========== 
function slideVisibility(slide1, slide2)
{
	for(var i = numberOfSlides-1; i >= 0; i--)
	{
		if(currentSlide == numberOfSlides-1)
			slide2 = 0;	
		if(i == slide1)
			toggle(slideShowImages[slide1], "show");
		else if(i == slide2)
			toggle(slideShowImages[slide2], "show");
		else
			toggle(slideShowImages[i], "hide");
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
	toggle(hud, "show");
	for(var i = 1; i < numberOfSlides+1; i++)
	{
		var pos = i-1;
		//slideShowImages[pos].style.left = slideShowImageCoordinates[pos] + 'px';
		slideShowImages[pos].style.left = slideShowImageCoordinates[pos] + '%';
		//slideShowImages[pos].style.top = "0px";
	}	
	setTimeout(draw, 1000/frameRate);
}
//=============================================================




/* ============ CONTROLS FUNCTIONS  ============*/

//var handleClick = function(event)
function handleClick(event)
{
	event.preventDefault();

		isClicked = true;
}



//var handleRelease = function(e)
function handleRelease(e)
{
	isClicked = false;
	lastY=-1;
	lastX=-1;
}


//var handleSwipe = function(event)
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


//var handleMouse = function(event)
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


function blink(element)
{
	
	if(isVisible(element))
	{
		toggle(element, "hide");
	}
	else
	{
		toggle(element, "show");
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


