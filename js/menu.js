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
	nav.style.opacity = 1;
	if(window.innerWidth>800)
	{
		nav.style.display = "inline-block";
		nav.style.left = "auto";
	}
	if(window.innerWidth<800)
	{
		nav.style.display = "none";
		pulled = false;
	}
}