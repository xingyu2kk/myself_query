//common.js

var common={
	getStyle:function(obj,sName){
		return (obj.currentStyle||getComputedStyle(obj,false))[sName];
	},
	getByClass:function(obj,sName){
		var arr=obj.getElementsByTagName('*');
		var aObj=[];
		for(var i=0;i<arr.length;i++){
			var str=arr[i].className;
			var arr2=str2.split(' ');
			if(common.findInArr(sName,arr2)){
				aObj.push(arr[i]);
			};
		};
		return aObj;
	},
	findInArr:function(sName,arr){
		for(var i=0;i<arr.length;i++){
			if(sName==arr[i]){
				return true;
			};
		};
		return false;
	},
	toDub:function(n){
		if(n<10){
			return '0'+n;
		}else{
			return ''+n;
		};
	},
	getRandom:function(n,m){
		return parseInt(Math.random()*(m-n)+n);
	},
	getPos:function(obj){
		var l=0;
		var t=0;
		while(obj){
			l=l+obj.offsetLeft;
			t=t+obj.offsetTop;
			obj=obj.offsetParent;
		};
		return {'left':l,'top':t};
	},
	addEvent:function(obj,sEv,fn){
		if(obj.addEventListener){
			obj.addEventListener(sEv,fn,false);
		}else{
			obj.attachEvent(sEv,fn);
		};
	},
	removeEvent:function(obj,sEv,fn){
		if(obj.removeEventListener){
			obj.removeEventListener(sEv,fn,false);
		}else{
			obj.dettachEvent(sEv,fn);
		};
	},
	addWheel:function(obj,fn){
		if(navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
			obj.addEventListener('DOMMouseScroll',wheel,false);
		}else{
			obj.onmousewheel=wheel;
		};
		function wheel(ev){
			var oEvent=ev||event;
			var bDown=true;
			if(oEvent.wheelDelta){
				if(oEvent.wheelDelta>0){
					bDown=false;
				}else{
					bDown=true;
				};
			}else{
				if(oEvent.detail>0){
					bDown=true;
				}else{
					bDown=false;
				};
			};
			fn(bDown);
		};
	},
	move:function(obj,json,options){
		var options=options||{};
		var duration=options.duration||1000;
		var count=Math.floor(duration/30);
		var easing=options.easing||'linear';
		var start={};
		var dis={};
		for(name in json){
			start[name]=parseFloat(common.getStyle(obj,name));
			dis[name]=json[name]-start[name];
		};
		var n=0;
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			n++;
			for(name in json){
				switch(easing){
					case 'linear':
						var a=n/count;
						var cur=start[name]+dis[name]*a;
						break;
					case 'ease-in':
						var a=n/count;
						var cur=start[name]+dis[name]*a*a*a;
						break;
					case 'ease-out':
						var a=1-n/count;
						var cur=start[name]+dis[name]*(1-a*a*a);
						break;
				};
				if(name=='opacity'){
					obj.style[name]=cur;
				}else{
					obj.style[name]=cur+'px';
				};
			};
			if(n>=count){
				clearInterval(obj.timer);
				options.complete && options.complete();
			};
		},30);
	},
	url2json:function(str){
		var arr=str.split('&');
		var json={};
		for(var i=0;i<arr.length;i++){
			json[arr[i].split('=')[0]]=arr[i].split('=')[1];
		};
		return json;
	},
	json2url:function(json){
		var arr=[];
		for(name in json){
			arr.push(name+'='+json[name]);
		};
		var str=arr.join('&');
		return str;
	},
};