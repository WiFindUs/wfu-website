/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-testprop-testallprops-domprefixes
 */
;window.Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a){var e=a[d];if(!z(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.cssanimations=function(){return C("animationName")};for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e}(this,this.document);


//=====================GLOBAL VARIABLES========================
var container; //the fixed container that's always in viewport
var clockTimer;

var slideContainers = [];		//contains slide's contents (image, text, etc)
var slideImages = [];
var slideImagesSrc = [];

var selectorBtns = [];

var numSlides;
var current =0;
var target = 1;
//=============================================================


//==========================INITIALISE============================
window.addEventListener('load', initialise);

function initialise()
{
	
	container = document.getElementById("slides");	
	getSlides();
	numSlides = slideImages.length;
	
	for(var i=0; i<numSlides; i++)
	{
		slideImagesSrc[i] = slideImages[i].currentSrc; //store the current src for slide images in array; used to determine resizeSlide()
		if(i!=0)
		{
			slideContainers[i].style.opacity = 0;
		}
	}
	
	/* CSS classes:
	*	-'slideContainer-noscript' used to hide the slides it's applied to when javascript not support or disabled
	*	so the user gets the most important slide & so the user doesn't see the other slides while they load
	*
	*	-'coverContainer' used as fall back when javascript not support or disabled
	*/
	for(var i=0; i<numSlides; i++)
	{
		removeClass(slideContainers[i], 'slideContainer-noscript');
		removeClass(slideImages[i], 'coverContainer');
	}
	
	resizeSlide();
	
	/*play slideshow only if there is:
	* -more than one slide: just in case only one image is desired and maintainer doesn't want/forgets to remove this script
	* -CSS3 Animations is supported by the browser
	*
	* Otherwise, just display the first slide
	*/
	if(numSlides > 1 && Modernizr.cssanimations)
	{
		createSelectorBtns(numSlides);
		addClass(selectorBtns[current], 'selected-btn');

		current = 0;
		
		clock();	
	}
	
	//remove loading gif when slides are ready
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


function createSelectorBtns(numSlides)
{		
	var content="";
	for(var i=0; i<numSlides; i++)
	{
		var selectorID = "selector"+i;
		content += "<div class=\"selector-btn\" id=\""+selectorID+"\"><span></span></div>";
	}
	
	document.getElementById('selector-btns').innerHTML = content;
	
	
	for(var i=0; i<numSlides; i++)
	{
		var selectorID = "selector"+i;
		selectorBtns[i] = document.getElementById(selectorID);
		selectorBtns[i].addEventListener('click', goToSlide);
		selectorBtns[i].slideIndex = i; //used in goToSlide()
	}
}
//=============================================================


//==========================UPDATE=============================
function update()
{	

	fadeIn(slideContainers[target]);
	fadeOut(slideContainers[current]);

	removeClass(selectorBtns[current], 'selected-btn');
	
	current = target;
	if(current == numSlides-1)
	{
		target=0;
	}
	else
	{
		var holder = current;
		target = holder+1;
	}
	
	addClass(selectorBtns[current], 'selected-btn');
	onDemand = false; 
}

function clock()
{	
	clockTimer = setInterval(update, 5000);
}


//goToSlide() called when a selector button is clicked/touched 
function goToSlide(evt)
{
	if(current!=evt.target.slideIndex)
	{
		onDemand = true;
		//clear timer
		clearInterval(clockTimer);
		
		target = evt.target.slideIndex;
		update();
		clock();
	}
}

//=============================================================




//==========================OTHER FUNCTIONS=============================


function fadeOut(element)
{
	removeClass(element, 'fade-in');
	addClass(element, 'fade-out');
}

function fadeIn(element) 
{
	removeClass(element, 'fade-out');
	addClass(element, 'fade-in');
}

window.addEventListener('resize', resizeCheck);

function resizeCheck()
{
	clearStyle(); //keep for menu.js -- not sure if needed: TEST
	resizeSlide();
	setTimeout(checkSrc, 1000);
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


function checkSrc()
{
	var needResize = false;
	for(var i=0; i<numSlides; i++)
	{
		if (slideImagesSrc[i] !== slideImages[i].currentSrc)
		{
			slideImagesSrc[i] = slideImages[i].currentSrc;
			needResize = true;
			
		}
	}
	
	if(needResize)
	{
		resizeSlide();
	}
}

//=============================================================