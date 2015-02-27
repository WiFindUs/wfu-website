var swapped = false;
var boxNodeList;

window.onload = function()
{
	getBoxes();
	orderCheck();
}

function getBoxes()
{
	//NodeList objects
	if(document.getElementsByClassName)
	{
		boxNodeList = document.getElementsByClassName("altFeat");
	}
	else //IE8
	{
		boxNodeList = document.querySelectorAll(".altFeat");
	}
}

function switchOrder()
{
	for(var i=0; i<boxNodeList.length; i++)
    {
		boxNodeList[i].appendChild(boxNodeList[i].firstElementChild);
	}
}

window.addEventListener('resize', orderCheck);

function orderCheck()
{
	if(window.innerWidth < 900 && !swapped)
	{
		switchOrder();
		swapped = true;
	}
	
	if(window.innerWidth >= 900 && swapped)
	{
		switchOrder();
		swapped = false;
	}
}