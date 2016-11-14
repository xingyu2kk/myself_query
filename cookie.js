//cookie.to

function addCookie(name,value,iDay){
	var oDate=new Date();
	if(iDay){
		oDate.setDate(oDate.getDate()+iDay);
		oDate.toGMTString();
		document.cookie=name+'='+value+'; PATH=/; EXPIRES='+oDate;
	}else{
		document.cookie=name+'='+value+'; PATH=/;';
	}
	
};
function getCookie(name){
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		if(arr[i].split('=')[0]==name){
			return arr[i].split('=')[1];
		};
	};
	return '';
};
function removeCookie(name){
	addCookie(name,1,-1);
};