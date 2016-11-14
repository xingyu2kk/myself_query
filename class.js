

function hasClass(obj,sClass){
	var str=obj.className;
	var re=new RegExp('\\b'+sClass+'\\b','g');
	if(re.test(str)){
		return true;
	}
	return false;
}
function addClass(obj,sClass){
	
	if(obj.className){
		var re=new RegExp('\\b'+sClass+'\\b','g');
		if(!re.test(obj.className)){
			obj.className=obj.className+' '+sClass;
		}
	}else{
		obj.className=sClass;
	}
}

function removeClass(obj,sClass){
	var re=new RegExp('\\b'+sClass+'\\b','g');
	obj.className=obj.className.replace(re,'').replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ');
}