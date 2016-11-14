//封装一个完美的ajax
function json2url(json){
	json.t=Math.random();
	var arr=[];
	for(name in json){
		arr.push(name+'='+encodeURIComponent(json[name]));
	}
	return arr.join('&');
}
//url,data,type,success,error
function ajax(json){
	if(!json.url){
		return;
	}
	json=json||{};
	json.data=json.data||{};
	json.type=json.type||'GET';
	json.timeout=json.timeout||10000;
	//创建一个Ajax对象兼容性写法
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHttp');
	}
	//判断数据传送方法
	//建立链接
	//发送请求
	switch(json.type.toLowerCase()){
		case 'get':
		oAjax.open('GET',json.url+'?'+json2url(json.data),true);
		oAjax.send();
		break;
		case 'post':
		oAjax.open('POST',json.url,true);
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		oAjax.send(json2url(json.data));
		break;
	}
	//数据传送过程中执行代码
	json.loading&&json.loading();
	//数据传送超时执行代码
	var timer=setTimeout(function(){
		json.error&&json.error();
		json.complete&&json.complete();
		oAjax.onreadystatechange=null;
	},json.timeout);
	//接收数据
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				clearTimeout(timer);
				json.success&&json.success(oAjax.responseText);
				//加载完成执行代码
				json.complete&&json.complete();
			}else{
				clearTimeout(timer);
				json.error&&json.error();
				//加载完成执行代码
				json.complete&&json.complete();
			}
		}
	};
}