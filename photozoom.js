!function(win){
	var doc = win.document;
	var tools = {
		getByClass : function(oParent,sClass){
			var aEle = oParent.getElementsByTagName('*');
			var arr = [];
			for(var i=0;i<aEle.length;i++){
				if(aEle[i].className == sClass){
					arr.push(aEle[i]);
				}
			}
			return arr;
		},
		$ : function(id){
			return doc.getElementById(id);
		},
		addEvent : function(elem,type,fn){
			if(elem.addEventListener){
				elem.addEventListener(type,fn,false);
			}else if(elem.attachEvent){
				elem.attachEvent('on'+type,fn);
			}else{
				elem['on'+type] = fn;
			}
		},
		extend : function(define,source){
			for(var property in source){
				define[property] = source[property];	
			}	
			return define;
		}
	}
	
	var photozoom = function(opts){
		this.oParent = opts.oParent;
		this.small = opts.small_pic;
		this.FloatLayer = opts.float_layer;
		this.bigPic = opts.big_pic;
		this.bigImg = opts.big_pic.getElementsByTagName('img')[0];
		this.init();
	}
	photozoom.prototype = {
		init : function(){//初始化
			var This = this;
			tools.addEvent(this.small,'mouseover',function(){
				This.showOrHide(true);
			});
			tools.addEvent(this.small,'mouseout',function(){
				This.showOrHide(false);
			});
		},
		showOrHide : function(flag){//显示隐藏
			if(flag){
				this.FloatLayer.style['display'] = 'block';
				this.bigPic.style['display'] = 'block';
				this.move();
			}else{
				this.FloatLayer.style['display'] = 'none';
				this.bigPic.style['display'] = 'none';	
			}
		},
		getArea : function(ev){//获取坐标
			var oEvent = ev || window.event;
			return {
				x : oEvent.clientX,
				y : oEvent.clientY
			}
		},
		move : function(){//鼠标移动
			var This = this;
			tools.addEvent(this.small,'mousemove',function(ev){
					var l =  This.getArea(ev).x - This.small.offsetLeft - This.oParent.offsetLeft - This.FloatLayer.offsetWidth/2;
					var t = This.getArea(ev).y - This.small.offsetTop - This.oParent.offsetTop - This.FloatLayer.offsetHeight/2;
					if(l <= 0){
						l = 0;	
					}else if(l >= (This.small.offsetWidth - This.FloatLayer.offsetWidth)){
						l = This.small.offsetWidth - This.FloatLayer.offsetWidth;
					}
					if(t <= 0){
						t = 0;	
					}else if(t >=  (This.small.offsetHeight - This.FloatLayer.offsetHeight)){
						t = This.small.offsetHeight - This.FloatLayer.offsetHeight;
					}
					This.l = l;
					This.t = t;
					This.FloatLayer.style['left'] = l+'px';
					This.FloatLayer.style['top'] = t+'px';
					This.posPhoto();
			})
		},
		posPhoto : function(){//设置图片位置
			var percentX = this.l/(this.small.offsetWidth - this.FloatLayer.offsetWidth);
			var percentY = this.t/(this.small.offsetHeight - this.FloatLayer.offsetHeight);
			this.bigImg.style['left'] = -percentX * (this.bigImg.offsetWidth - this.bigPic.offsetWidth)+'px';
			this.bigImg.style['top'] = -percentY * (this.bigImg.offsetHeight - this.bigPic.offsetHeight)+'px';
		}
	}
	var defaultConfig = {
		oParent : tools.$('wrapper'),
		small_pic : tools.getByClass(doc,'small_pic')[0],
		float_layer : tools.getByClass(doc,'float_layer')[0],
		big_pic : tools.getByClass(doc,'big_pic')[0]
	}
	win.photozoom = function(opts){
		var opts = tools.extend(defaultConfig,opts);
		new photozoom(opts);
	};
}(this);
