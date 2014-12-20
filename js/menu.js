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