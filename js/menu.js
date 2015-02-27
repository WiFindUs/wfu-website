var pulled = false;

function toggleMenu(source)
{
	if((source == "navSelected" && window.innerWidth<800) || source =="icon" || (source == "contact" && window.innerWidth<800))
	{
		var nav = document.getElementById("nav");
		
		if(!pulled)
		{
			nav.style.display = "block";
			showMenu();
			pulled = true;
		}
		
		else
		{
			hideMenu();
			pulled = false;
		}
	}
}


function showMenu()
{
	var nav = document.getElementById("nav");
	var left = -100;
	var opacity = 0;
	nav.style.opacity = opacity;
	nav.style.left = left+"%";
	
	var timer;
	timer = setInterval(function()
	{
		left = left+5;
		nav.style.left = left+"%";
		
		if(opacity<1)
		{
			opacity = opacity+0.05;
			nav.style.opacity = opacity;
		}
		
		if(left==0)
		{
			window.clearInterval(timer);
		}
	}, 10);
}

function hideMenu()
{
	var nav = document.getElementById("nav");
	var left = 0;
	var opacity = 1;
	nav.style.opacity = opacity;
	nav.style.left = left+"%";
	
	var timer;
	timer = setInterval(function()
	{
		left = left-5;
		nav.style.left = left+"%";
		
		if(opacity>0)
		{
			opacity = opacity-0.07;
			nav.style.opacity = opacity;
		}
		
		if(left==-100)
		{
			window.clearInterval(timer);
			nav.style.display = "none";
		}
	}, 10);
}


function goTo(link)
{
	if(window.innerWidth<800)
	{
		document.location.href = link;
	}
}


window.addEventListener('resize', clearStyle);

function clearStyle()
{
	var nav = document.getElementById("nav");
	if(nav.style.removeProperty)
	{
		nav.style.removeProperty('display');
		nav.style.removeProperty('opacity');
		nav.style.removeProperty('left');
	}
	else //IE <9
	{
		nav.style.removeAttribute('display');
		nav.style.removeAttribute('opacity');
		nav.style.removeAttribute('left');
	}
	pulled = false;
}



window.addEventListener('load', clearNoscript);

function clearNoscript()
{
	removeClass(document.getElementById("nav"), 'nav-noscript');
	removeClass(document.getElementById("header"), 'header-noscript');
	removeClass(document.getElementById("logo"), 'logo-noscript');
	removeClass(document.getElementById("menu"), 'menu-noscript');
	console.log("here");
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