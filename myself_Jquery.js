function $(arg){
	return new ZQuery(arg);
}
function ZQuery(arg){
	this.elements=[];
	this.domString='';
	switch(typeof arg){
		case 'function':
		domReady(arg);
		break;
		case 'string':
		if(arg.indexOf('>')!=-1){
			this.domString=arg;
		}else{
			this.elements=getEle(arg);
		}
		break;
		case 'object':
		if(arg instanceof Array){
			this.elements=this.elements.concat(arg);
		}else{
			this.elements.push(arg);
		}
	}
}
function domReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			fn.apply(this,arguments);
		},false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn.apply(this,arguments);
			}
		});
	}
}
function getEle(str,apr){
	var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/g);
	var aChild=[];
	var aParent=apr||[document];
	for(var i=0;i<arr.length;i++){
		aChild=getByStr(aParent,arr[i]);
		aParent=aChild;
	}
	return aChild;
}
function getByClass(obj,sName){
	if(obj.getElementsByClassName){
		return obj.getElementsById(sName);
	}else{
		var reg=new RegExp('\\b'+sName+'\\b','g');
		var aObj=obj.children;
		var aChild=[];
		for(var i=0;i<aObj.length;i++){
			if(reg.test(aObj[i].className)){
				aChild.push(aObj[i]);
			}
		}
		return aChild;
	}
}
function getByStr(apr,str){
	var aChild=[];
	for(var i=0;i<apr.length;i++){
		switch(str.charAt(0)){
			case '#':
			var aRes=document.getElementById(str.substring(1));
			aChild.push(aRes);
			break;
			case '.':
			var aRes=getByClass(apr[i],str.substring(1));
			for(var j=0;j<aRes.length;j++){
				aChild.push(aRes[j]);
			}
			break;
			default:
			if(/\w+\:\w+(\(\d+\))?/g.test(str)){
				var arr=str.split(/\:|\(|\)/g);
				var aRes=apr[i].getElementsByTagName(arr[0]);
				switch(arr[1]){
					case 'first':
					aChild.push(aRes[0]);
					break;
					case 'last':
					aChild.push(aRes[aRes.length-1]);
					break;
					case 'even':
					for(var j=0;j<aRes.length;j+=2){
						aChild.push(aRes[j]);
					}
					break;
					case 'odd':
					for(var j=1;j<aRes.length;j++){
						aChild.push(aRes[j]);
					}
					break;
					case 'eq':
					aChild.push(aRes[arr[2]]);
					break;
					case 'lt':
					for(var j=0;j<arr[2];j++){
						aChild.push(aRes[j]);
					}
					break;
					case 'gt':
					for(var j=parseInt(arr[2])+1;j<aRes.length;j++){
						aChild.push(aRes[j]);
					}
				}
			}else if(/\w+\.\w+/g.test(str)){
				var arr=str.split(/\./g);
				var aRes=apr[i].getElementsByTagName(arr[0]);
				var reg=new RegExp('\\b'+arr[1]+'\\b','g');
				for(var j=0;j<aRes.length;j++){
					if(reg.test(aRes[j].className)){
						aChild.push(aRes[j]);
					}
				}
			}else if(/\w+\[\w+\=\w+\]/g.test(str)){
				var arr=str.split(/\[|\=|\]/g);
				var aRes=apr[i].getElementsByTagName(arr[0]);
				for(var j=0;j<aRes.length;j++){
					if(aRes[j][arr[1]]==arr[2]){
						aChild.push(aRes[j]);
					}
				}
			}else{
				var aRes=apr[i].getElementsByTagName(str);
				for(var j=0;j<aRes.length;j++){
					aChild.push(aRes[j]);
				}
			}
			break;
		}
	}
	return aChild;
}
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var ev=ev||event;
			if(fn.apply(obj,arguments)==false){
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		},false);
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			var ev=ev||event;
			if(fn.apply(obj,arguments)==false){
				ev.cancelBubble=true;
				return false;
			}
		});
	}
}
'click contextmenu kedown keup mouseover mousemove mouseout mousedown mouseup load scroll resize input propertychange'.replace(/\w+/g,function(sEv){
	ZQuery.prototype[sEv]=function(fn){
		for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],sEv,fn);
		}
	};
});
function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
ZQuery.prototype.css=function(){
	var arg=arguments;
	if(arg.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[arg[0]]=arg[1];
		}
	}else{
		switch(typeof arg){
			case 'object':
				for(var i=0;i<this.elements.length;i++){
					for(name in arg){
						this.elements[i][name]=arg[name];
					}
				}
			break;
			case 'str':
			return getStyle(this.elements[0],arg);
		}
	}
};
ZQuery.prototype.attr=function(){
	var arg=arguments;
	if(arg.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(arg[0],arg[1]);
		}
	}else{
		switch(typeof arg){
			case 'object':
			for(var i=0;i<this.elements.length;i++){
				for(name in arg){
					this.elements[i].setAttribute(name,arg[name]);	
				}
			}
			break;
			case 'string':
			return this.elements[0].getAttribute(arg);
		}
	}
};
ZQuery.prototype.addClass=function(str){
	var reg=new RegExp('\\b'+str+'\\b','g');
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className){
			if(!reg.test(this.elements[i].className)){
				this.elements[i].className=this.elements[i].className+str;
			}
		}else{
			this.elements[i].className=str;
		}
	}
};
ZQuery.prototype.removeClass=function(str){
	var reg=new RegExp('\\b'+str+'\\b','g');
	for(var i=0;i<this.elements.length;i++){
		if(reg.test(this.elements[i].className)){
			this.elements[i].className=this.elements[i].className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		}
	}
};
ZQuery.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
	}
};
ZQuery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';
	}
};
ZQuery.prototype.toggle=function(){
	var arg=arguments;
	var _this=this;
	for(var i=0;i<this.elements.length;i++){
		(function(index){
			addEvent(_this.elements[i],'click',function(){
				var fn=arg[index%arg.length];
				fn&&fn.apply(this,arguments);
				index++;
			});
		})(0);
	}
};
function move(obj,json,options){
	options=options||{};
	options.duration=options.duration||1000;
	options.easing=options.easing||'linear';
	var count=Math.floor(options.duration/16);
	var start={};
	var dis={};
	var n=0;
	for(name in json){
		start[name]=parseFloat(getStyle(obj,name));
		dis[name]=json[name]-start[name];
	}
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		for(name in json){
			switch options.easing:
			case 'linear':
			var a=n/count;
			var cur=start[name]+dis[name]*a;
			break;
			case 'ease-in':
			var a=n/count;
			var cur=start[name]+dis[name]*a*a*a;
			break;
			case 'ease-out':
			var a=(1-n/count);
			var cur=start[name]+dis[name]*(1-a*a*a);
			break;
			if(name=='opacity'){
				obj.style[name]=cur;
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.complete&&options.complete();
		}
	},16);
}
ZQuery.prototype.animate=function(json,options){
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i],json,options);
	}
};
ZQuery.prototype.val=function(){
	var arg=arguments;
	if(arg||arg==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].value=arg;
		}
	}else{
		return this.elements[0].value;
	}
};
ZQuery.prototype.html=function(){
	var arg=arguments;
	if(arg||arg==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML=arg;
		}
	}else{
		return this.elements[0].innerHTML;
	}
};
ZQuery.prototype.index=function(){
	var obj=this.elements[this.elements.length-1];
	var aChild=obj.parentNode.children;
	for(var i=0;i<aChild.length;i++){
		if(aChild[i]==obj){
			return i;
		}
	}
};
ZQuery.prototype.eq=function(num){
	for(var i=0;i<this.elements.length;i++){
		return $(this.elements[num]);
	}
};
ZQuery.prototype.get=function(num){
	for(var i=0;i<this.elements.length;i++){
		return this.elements[num]
	}
};
function json2url(json){
	var arr=[];
	for(name in json){
		arr.push(name+'='+encodeURIComponent(json[name]));
	}
	return arr.join('&');
}
function ajax(json){
	if(!json.url){
		return;
	}
	json=json||{};
	json.data=json.data||{};
	json.type=json.type||'GET';
	json.timeout=json.timeout||10000;
	var timer=null;
	json.data.t=Math.random();
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHttp');
	}
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
	json.loading&&json.loading();
	clearTimeout(timer);
	timer=setTimeout(function(){
		json.complete&&json.complete();
		json.error&&json.error();
		oAjax.onreadystatechange=null;
	},json.timeout);
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				clearTimeout(timer);
				json.complete&&json.complete();
				json.success&&json.success(oAjax.responseText);
			}else{
				clearTimeout(timer);
				json.complete&&json.complete();
				json.error&&json.error(oAjax.status);
			}
		}
	};
}
$.ajax=ZQuery.ajax=function(json){
	ajax(json);
};
function jsonp(options){
	if(!options.url){
		return;
	}
	options=options||{};
	options.data=options.data||{};
	optison.cbName=options.cbName||'cb';
	options.timeout=options.timeout||10000;
	var fnName='jsonp'+Math.random();
	fnName=fnName.replace('.','');
	var timer=null;
	options.data[option.cbName]=fnName;
	window[fnName]=function(json){
		clearTimeout(timer);
		options.success&&options.success(json);
		document.head.removeChild(oS);
	};
	timer=setTimeout(function(){
		options.error&&options.error();
		window[fnName]=null;
	},options.timeout);
	var oS=document.createElement('script');
	oS.src=options.url+'?'+json2url(options.data);
	document.body.appendChild(oS);
}
$.getScript=ZQuery.getScript=function(options){
	jsonp(options);
};
ZQuery.prototype.each=function(fn){
	for(var i=0;i<this.elements.length;i++){
		fn&&fn.class(this.elements[i],i,this.elements[i]);
	}
};
ZQuery.prototype.find=function(str){
	var aParent=this.elements;
	var aChild=getEle(str,aParent);
	return $(aChild);
};
ZQuery.prototype.appendTo = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
	}
	return this;
};
ZQuery.prototype.insertBefore = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
	}	
};
ZQuery.prototype.insertAfter = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('afterEnd',this.domString);
	}
	return this;
};
ZQuery.prototype.prependTo = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('afterBegin',this.domString);
	}
};
ZQuery.prototype.remove=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
};
$.fn=$.prototype=ZQuery.protype;
$.fn.extend=$.prototype.extend=ZQuery.protype.extend=function(){
	for(name in arguments){
		ZQuery.prototype[name]=arguments[name];
	}
};
