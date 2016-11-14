function getByClass(oParent,sClass){
	//支持的浏览器
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
	//不支持
		var res = [];
		var aAll = oParent.getElementsByTagName('*');
		for(var i = 0;i<aAll.length;i++){
			//str = 'red on on2 active' ==aAll[i].className
			//var reg = /\bsClass\b/g;
			var reg = new RegExp('\\b'+sClass+'\\b','g');
			if(reg.test(aAll[i].className)){
				res.push(aAll[i]);
			}
		}
		return res;	
	}
}
//hasClass
function hasClass(obj,sClass){
	var reg = new RegExp('\\b'+sClass+'\\b','g');

	return reg.test(obj.className);
}
function addClass(obj,sClass){
	//判断存不存在class
	if(obj.className){
		//看存在的class是不是要添加的
		if(!hasClass(obj,sClass)){
			obj.className += ' '+ sClass;
		}
		
	}else{
		obj.className = sClass;
	}
}
function removeClass(obj,sClass){
	var reg = new RegExp('\\b'+sClass+'\\b','g');
	obj.className = obj.className.replace(reg,'').replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ');
}







