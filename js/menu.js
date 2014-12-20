var pulled = false;

function toggleMenu()
{
	var nav = document.getElementById("nav");
	
	if(!pulled)
	{
		nav.style.display = "block";
		pulled = true;
	}
	
	else
	{
		nav.style.display = "none";
		pulled = false;
	}

}

window.addEventListener('resize', clearStyle);

function clearStyle()
{
	var nav = document.getElementById("nav");
	
	if(window.innerWidth>800)
	{
		nav.style.display = "inline-block";
	}
	if(window.innerWidth<800)
	{
		/*if(nav.style.display == "none")
		{
			nav.style.display = "none";
		}
		else
		{
			nav.style.display = "block";
		}*/
		
		nav.style.display = "none";
	}
}