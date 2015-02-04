/*
window.addEventListener('resize', swapColumns);

function swapColumns()
{
	var thumbnail = document.getElementById("featThumb");
	var desc = document.getElementById("featDesc");
	
	var rectThumb = thumbnail.getBoundingClientRect();
	var rectDesc = desc.getBoundingClientRect();
	
	thumbnail.style.top = rectDesc.top;
	desc.style.top = rectThumb.top;
	
	console.log("desc:" +rectDesc.top);
	console.log("thumb:" +rectThumb.top);
}
*/