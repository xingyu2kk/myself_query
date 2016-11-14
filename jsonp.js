//封装一个jsonp
/*function jsonp(options){
	options=options||{};
	if(!options.url){
		return;
	}
	options.data=options.data||{};
	options.cbName=options.cbName||'cb';
	options.timeout=options.timeout||10000;
	var fnName='jsonp_'+Math.random();
	var timer=null;
	fnName=fnName.replace('.','');
	options.data[option.cbName]=fnName;
	window[fnName]=function(json){
		clearInterval(timer);
		options.success&&options.success(json);
		document.head.removeChild(oS);
	}
	timer=setTimeout(function(){
		options.error&&options.error();
		window[fnName]=null;
		document.head.removeChild(oS);
	},options.timeout);
	var oS=document.createElement('script');
	oS.src=options.url+'?'+json2url(options.data);
	document.head.appendChild(oS);
}*/
function json2url(json){
	var arr=[];
	for(name in json){
		arr.push(name+'='+json[name]);
	}
	return arr.join('&');
}
//url,data,cbName,success
function jsonp(options){
	options=options||{};
	if(!options.url){
		return;
	}
	options.data=options.data||{};
	options.cbName=options.cbName||'cb';
	options.timeout=options.timeout||10000;
	var timer=null;
	var fnName='jsonp_'+Math.random();
	fnName=fnName.replace('.','');
	
	window[fnName]=function(json){
		clearTimeout(timer);
		options.success&&options.success(json);
		document.head.removeChild(oS);
	}
	clearTimeout(timer);
	timer=setTimeout(function(){
		options.error&&options.error();
		window[fnName]=null;
		//document.head.removeChild(oS);
	},options.timeout);

	options.data[options.cbName]=fnName;
	var oS=document.createElement('script');
	oS.src=options.url+'?'+json2url(options.data);
	document.head.appendChild(oS);
}