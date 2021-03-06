(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var App = function() { };
App.__name__ = true;
App.main = function() {
	var iptPxToIn;
	var canvas = window.document.getElementById("canvas");
	var surface = new Surface(canvas);
	App.switchState(new state_Custom(surface));
	iptPxToIn = window.document.getElementById("inToPx");
	if(surface.inToPx == null) iptPxToIn.value = "null"; else iptPxToIn.value = "" + surface.inToPx;
};
App.switchState = function(newState) {
	if(App.currentState != null) {
		App.currentState.destroy();
		App.currentState = null;
	}
	newState.create();
	App.currentState = newState;
};
App.checkFloat = function(element,minVal) {
	if(minVal == null) minVal = 0;
	var number = parseFloat(element.value);
	if(!isFinite(number) || number < minVal) number = minVal;
	element.value = number;
	return number;
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
var Surface = function(canvas) {
	this.inToPx = 20;
	this.elements = [];
	this.canvas = canvas;
};
Surface.__name__ = true;
Surface.prototype = {
	add: function(element) {
		this.elements.push(element);
		this.draw();
	}
	,remove: function(element) {
		HxOverrides.remove(this.elements,element);
		this.draw();
	}
	,removeAll: function() {
		this.elements.splice(0,this.elements.length);
		this.draw();
	}
	,set_inToPx: function(value) {
		this.inToPx = Std["int"](Math.max(1,value));
		return this.inToPx;
	}
	,draw: function() {
		var context = this.canvas.getContext("2d",null);
		this.clear(context);
		var _g = 0;
		var _g1 = this.elements;
		while(_g < _g1.length) {
			var elt = _g1[_g];
			++_g;
			elt.draw(context);
		}
	}
	,clear: function(context) {
		context.clearRect(0,0,context.canvas.width,context.canvas.height);
	}
};
var element_IElement = function() { };
element_IElement.__name__ = true;
var element_Dogbone = function(x,y,width,height,radius) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.radius = radius;
};
element_Dogbone.__name__ = true;
element_Dogbone.__interfaces__ = [element_IElement];
element_Dogbone.prototype = {
	draw: function(context) {
		var xLeftBone = this.x + this.radius;
		var xRightBone = this.x + this.width - this.radius;
		var yTopBone = this.y;
		var yBottomBone = this.y + this.height;
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.fillStyle = "#000000";
		context.fill();
		context.lineWidth = 0;
		context.strokeStyle = "#000000";
		context.stroke();
		context.beginPath();
		context.arc(xLeftBone,yTopBone,this.radius,Math.PI,2 * Math.PI,false);
		context.fillStyle = "#000000";
		context.fill();
		context.stroke();
		context.beginPath();
		context.arc(xLeftBone,yBottomBone,this.radius,0,Math.PI,false);
		context.fillStyle = "#000000";
		context.fill();
		context.stroke();
		context.beginPath();
		context.arc(xRightBone,yTopBone,this.radius,Math.PI,2 * Math.PI,false);
		context.fillStyle = "#000000";
		context.fill();
		context.stroke();
		context.beginPath();
		context.arc(xRightBone,yBottomBone,this.radius,0,Math.PI,false);
		context.fillStyle = "#000000";
		context.fill();
		context.stroke();
	}
};
var element_Rectangle = function(x,y,width,height,lineWidth,lineColor,fillColor) {
	if(lineColor == null) lineColor = "black";
	if(lineWidth == null) lineWidth = 1;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.fillColor = fillColor;
	this.lineWidth = lineWidth;
	this.lineColor = lineColor;
};
element_Rectangle.__name__ = true;
element_Rectangle.__interfaces__ = [element_IElement];
element_Rectangle.prototype = {
	draw: function(context) {
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		if(this.fillColor != null) {
			context.fillStyle = this.fillColor;
			context.fill();
		}
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.lineColor;
		context.stroke();
	}
};
var element_Text = function(x,y,text) {
	this.x = x;
	this.y = y;
	this.text = text;
};
element_Text.__name__ = true;
element_Text.__interfaces__ = [element_IElement];
element_Text.prototype = {
	draw: function(context) {
		context.fillText(this.text,this.x,this.y);
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var stand_Stand = function(surface,width,height,bitWidth,thickness) {
	this.surface = surface;
	this.width = width;
	this.height = height;
	this.bitWidth = bitWidth;
	this.thickness = thickness;
};
stand_Stand.__name__ = true;
stand_Stand.prototype = {
	updateTotalSize: function() {
	}
	,createElements: function() {
		var radiusBone = this.bitWidth * this.surface.inToPx / 2;
		var wElt = this.width * this.surface.inToPx;
		var hElt = this.height * this.surface.inToPx;
		this.centralPart = new element_Rectangle(0,0,wElt,hElt);
		wElt = (this.width - 2 * stand_Stand.MARGIN_CENTRAL) * this.surface.inToPx;
		hElt = (this.thickness + 0.0625) * this.surface.inToPx;
		this.dogbone = new element_Dogbone(0,0,wElt,hElt,radiusBone);
		wElt = this.dogbone.width;
		hElt = stand_Stand.HEIGHT_SUPPORT * this.surface.inToPx;
		this.supportPart = new element_Rectangle(0,0,wElt,hElt);
		wElt = this.supportPart.width;
		hElt = this.thickness * this.surface.inToPx;
		this.supportCarving = new element_Rectangle(0,0,wElt,hElt,1,"grey","grey");
		this.surface.removeAll();
		this.surface.add(this.centralPart);
		this.surface.add(this.dogbone);
		this.surface.add(this.supportPart);
		this.surface.add(this.supportCarving);
	}
	,setBoardThickness: function(boardThickness) {
		this.thickness = Math.max(0,boardThickness);
		this.createElements();
	}
	,setBitWidth: function(bitWidth) {
		this.bitWidth = Math.max(0,bitWidth);
		this.createElements();
	}
	,getRealCoordinate: function(element,marginXinPx) {
		if(marginXinPx == null) marginXinPx = 0;
		var x = element.x;
		var y = this.surface.canvas.width - (element.y + element.height);
		return { x : (x - marginXinPx) / this.surface.inToPx, y : y / this.surface.inToPx, width : element.width / this.surface.inToPx, height : element.height / this.surface.inToPx};
	}
	,g: function(type,f,x,y,z) {
		if(type != 0 && type != 1) return "";
		var code = "G" + type;
		if(x != null) code += " X" + x;
		if(y != null) code += " Y" + y;
		if(z != null) code += " Z" + z;
		if(type == 1) code += " F" + f;
		return code;
	}
	,lengthVector: function(vector) {
		return Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
	}
	,calculateTap: function(start,end,size) {
		var tap = [];
		if(size <= 0) return tap;
		var vector = { x : end.x - start.x, y : end.y - start.y};
		var pathSize = this.lengthVector(vector);
		if(size >= pathSize) return tap;
		var normalized_x = vector.x / pathSize;
		var normalized_y = vector.y / pathSize;
		var cutLength = (pathSize - size) / 2;
		var vectorCut_x = cutLength * normalized_x;
		var vectorCut_y = cutLength * normalized_y;
		var tapStart = { x : start.x + vectorCut_x, y : start.y + vectorCut_y};
		var tapEnd = { x : end.x - vectorCut_x, y : end.y - vectorCut_y};
		tap.push(tapStart);
		tap.push(tapEnd);
		return tap;
	}
	,gcodeTap: function(start,end,zCurrentDepth,zDepthTopTap,feedrate) {
		var codes = [];
		codes.push(this.g(1,feedrate,start.x,start.y,zCurrentDepth));
		codes.push(this.g(1,feedrate,null,null,zDepthTopTap));
		codes.push(this.g(1,feedrate,end.x,end.y));
		codes.push(this.g(1,feedrate,null,null,zCurrentDepth));
		return codes.join("\n");
	}
	,cutPath: function(path,depth,bitLength,feedrate,rectangleAndTap) {
		if(rectangleAndTap == null) rectangleAndTap = false;
		if(path.length == 0 || depth == 0) return "";
		var codes = [];
		var safeZ = 2;
		var tapLength = 0.25;
		var tapHeight = 0.0625;
		var depthTopTap = depth + tapHeight;
		var currentDepth = 0;
		var iEnd = path.length - 1;
		codes.push(this.g(0,feedrate,path[0].x,path[0].y));
		while(currentDepth > depth) {
			currentDepth = Math.max(currentDepth - bitLength,depth);
			codes.push(this.g(1,feedrate,null,null,currentDepth));
			var _g1 = 0;
			var _g = path.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(rectangleAndTap && i > 0 && Math.abs(depth - currentDepth) <= tapHeight) {
					var tap = this.calculateTap(path[i - 1],path[i],tapLength);
					if(tap.length == 2) codes.push(this.gcodeTap(tap[0],tap[1],currentDepth,depthTopTap,feedrate));
				}
				codes.push(this.g(1,feedrate,path[i].x,path[i].y));
			}
			if(path[0].x != path[iEnd].x || path[0].y != path[iEnd].y) codes.push(this.g(1,feedrate,null,null,safeZ));
		}
		if(path[0].x == path[iEnd].x && path[0].y == path[iEnd].y) codes.push(this.g(1,feedrate,null,null,safeZ));
		return codes.join("\n");
	}
	,getPathArroundRectangle: function(coordinate) {
		var halfW = this.bitWidth / 2;
		var xLeft = coordinate.x - halfW;
		var xRight = coordinate.x + coordinate.width + halfW;
		var yDown = coordinate.y - halfW;
		var yUp = coordinate.y + coordinate.height + halfW;
		var path = [];
		path.push({ x : xLeft, y : yDown});
		path.push({ x : xRight, y : yDown});
		path.push({ x : xRight, y : yUp});
		path.push({ x : xLeft, y : yUp});
		path.push({ x : xLeft, y : yDown});
		return path;
	}
	,getPathInsideRectangle: function(coordinate,bitWidth) {
		var x = coordinate.x;
		var y = coordinate.y;
		var width = coordinate.width;
		var height = coordinate.height;
		var path = [];
		var halfW = bitWidth / 2;
		var xMin = x + halfW;
		var xMax = x + width - halfW;
		var currentY = y + halfW;
		var keepGoing = true;
		var goRight = true;
		var yStep = bitWidth * 3 / 4;
		if(width <= bitWidth) {
			xMin = x + width / 2;
			xMax = xMin;
		}
		if(height <= bitWidth) {
			path.push({ x : xMin, y : y + height / 2});
			if(xMin != xMax) path.push({ x : xMax, y : y + height / 2});
			return path;
		}
		while(keepGoing) {
			if(currentY + halfW >= y + height) {
				currentY = y + height - halfW;
				keepGoing = false;
			}
			if(goRight) {
				path.push({ x : xMin, y : currentY});
				path.push({ x : xMax, y : currentY});
			} else {
				path.push({ x : xMax, y : currentY});
				path.push({ x : xMin, y : currentY});
			}
			goRight = !goRight;
			currentY += yStep;
		}
		return path;
	}
	,getPathCentral: function() {
		return this.getPathArroundRectangle(this.getRealCoordinate(this.centralPart));
	}
	,getPathDogbone: function() {
		var halfW = this.bitWidth / 2;
		var coordinate = this.getRealCoordinate(this.dogbone);
		var yTopBone = coordinate.y + coordinate.height;
		var yDownBone = coordinate.y;
		var xLeft = coordinate.x + halfW;
		var xRight = coordinate.x + coordinate.width - halfW;
		var path = this.getPathInsideRectangle(coordinate,this.bitWidth);
		path.splice(0,0,{ x : xLeft, y : (yTopBone + yDownBone) / 2});
		path.splice(0,0,{ x : xLeft, y : yTopBone});
		path.splice(0,0,{ x : xLeft, y : yDownBone});
		path.splice(0,0,{ x : xLeft, y : (yTopBone + yDownBone) / 2});
		path.push({ x : xRight, y : (yTopBone + yDownBone) / 2});
		path.push({ x : xRight, y : yTopBone});
		path.push({ x : xRight, y : yDownBone});
		path.push({ x : xRight, y : (yTopBone + yDownBone) / 2});
		path.push({ x : xLeft, y : (yTopBone + yDownBone) / 2});
		return path;
	}
	,getPathSupportPart: function() {
		return this.getPathArroundRectangle(this.getRealCoordinate(this.supportPart));
	}
	,getPathSupportCarving: function() {
		var c = this.getRealCoordinate(this.supportCarving);
		return this.getPathInsideRectangle(c,this.bitWidth);
	}
	,getGCode: function(bitLength,feedrate) {
		return [];
	}
	,getBeginningGCode: function() {
		var code = "G20\nG90\n";
		code += this.g(0,0,null,null,2) + "\n";
		code += "M4 (spindle on)\n";
		return code;
	}
	,getEndingGCode: function() {
		var code = this.g(0,0,null,null,2) + "\n";
		code += this.g(0,0,0,0) + "\n";
		code += "M5\nM2\nM30";
		return code;
	}
};
var stand_StandFiles = function(surface,width,height,bitWidth,thickness) {
	this.marginSeparation = 50;
	stand_Stand.call(this,surface,width,height,bitWidth,thickness);
};
stand_StandFiles.__name__ = true;
stand_StandFiles.__super__ = stand_Stand;
stand_StandFiles.prototype = $extend(stand_Stand.prototype,{
	updateTotalSize: function() {
		var margin = this.bitWidth * 2;
		var cSupport = this.getRealCoordinate(this.supportPart);
		var realWidthSupport = cSupport.width + margin + this.bitWidth;
		var realHeightSupport = cSupport.height + margin + this.bitWidth;
		var pixelWidthSupport = realWidthSupport * this.surface.inToPx;
		var pixelHeightSupport = realHeightSupport * this.surface.inToPx;
		this.rectangleSizeSupport.x = this.supportPart.x - margin * this.surface.inToPx;
		this.rectangleSizeSupport.y = this.supportPart.y - this.bitWidth * this.surface.inToPx;
		this.rectangleSizeSupport.width = pixelWidthSupport;
		this.rectangleSizeSupport.height = pixelHeightSupport;
		this.horizontalSizeSupport.x = this.rectangleSizeSupport.x + this.rectangleSizeSupport.width / 2 - 5;
		this.horizontalSizeSupport.y = this.rectangleSizeSupport.y - 5;
		if(realWidthSupport == null) this.horizontalSizeSupport.text = "null"; else this.horizontalSizeSupport.text = "" + realWidthSupport;
		this.verticalSizeSupport.x = this.rectangleSizeSupport.x + this.rectangleSizeSupport.width + 5;
		this.verticalSizeSupport.y = this.rectangleSizeSupport.y + this.rectangleSizeSupport.height / 2 - 5;
		if(realHeightSupport == null) this.verticalSizeSupport.text = "null"; else this.verticalSizeSupport.text = "" + realHeightSupport;
		var cCentral = this.getRealCoordinate(this.centralPart);
		var realWidthCentral = cCentral.width + margin + this.bitWidth;
		var realHeightCentral = cCentral.height + margin + this.bitWidth;
		var pixelWidthCentral = realWidthCentral * this.surface.inToPx;
		var pixelHeightCentral = realHeightCentral * this.surface.inToPx;
		this.rectangleSizeCentral.x = this.centralPart.x - margin * this.surface.inToPx;
		this.rectangleSizeCentral.y = this.centralPart.y - this.bitWidth * this.surface.inToPx;
		this.rectangleSizeCentral.width = pixelWidthCentral;
		this.rectangleSizeCentral.height = pixelHeightCentral;
		this.horizontalSizeCentral.x = this.rectangleSizeCentral.x + this.rectangleSizeCentral.width / 2 - 5;
		this.horizontalSizeCentral.y = this.rectangleSizeCentral.y - 5;
		if(realWidthCentral == null) this.horizontalSizeCentral.text = "null"; else this.horizontalSizeCentral.text = "" + realWidthCentral;
		this.verticalSizeCentral.x = this.rectangleSizeCentral.x + this.rectangleSizeCentral.width + 5;
		this.verticalSizeCentral.y = this.rectangleSizeCentral.y + this.rectangleSizeCentral.height / 2 - 5;
		if(realHeightCentral == null) this.verticalSizeCentral.text = "null"; else this.verticalSizeCentral.text = "" + realHeightCentral;
	}
	,createElements: function() {
		stand_Stand.prototype.createElements.call(this);
		this.rectangleSizeSupport = new element_Rectangle(0,0,1,1,null,"red");
		this.horizontalSizeSupport = new element_Text(0,0,"0");
		this.verticalSizeSupport = new element_Text(0,0,"0");
		this.rectangleSizeCentral = new element_Rectangle(0,0,1,1,null,"red");
		this.horizontalSizeCentral = new element_Text(0,0,"0");
		this.verticalSizeCentral = new element_Text(0,0,"0");
		this.surface.add(this.rectangleSizeSupport);
		this.surface.add(this.horizontalSizeSupport);
		this.surface.add(this.verticalSizeSupport);
		this.surface.add(this.rectangleSizeCentral);
		this.surface.add(this.horizontalSizeCentral);
		this.surface.add(this.verticalSizeCentral);
		this.placeElements();
	}
	,placeElements: function() {
		var inToPx = this.surface.inToPx;
		var cHeight = this.surface.canvas.height;
		var margin = this.bitWidth * 2 * inToPx;
		var xLeft = margin;
		this.centralPart.x = xLeft;
		this.centralPart.y = cHeight - margin - this.centralPart.height;
		this.dogbone.x = this.centralPart.x + stand_Stand.MARGIN_CENTRAL * inToPx;
		this.dogbone.y = this.centralPart.y + this.centralPart.height - 0.875 * inToPx - this.dogbone.height;
		this.supportPart.x = xLeft + this.centralPart.width + this.marginSeparation;
		this.supportPart.y = cHeight - margin - this.supportPart.height;
		this.supportCarving.x = this.supportPart.x;
		this.supportCarving.y = this.supportPart.y + this.supportPart.height - 0.5 * inToPx - this.supportCarving.height;
		this.updateTotalSize();
		this.surface.draw();
	}
	,getPathSupportPart: function() {
		var margin = this.supportPart.x - this.bitWidth * this.surface.inToPx * 2;
		return this.getPathArroundRectangle(this.getRealCoordinate(this.supportPart,margin));
	}
	,getPathSupportCarving: function() {
		var margin = this.supportPart.x - this.bitWidth * this.surface.inToPx * 2;
		var c = this.getRealCoordinate(this.supportCarving,margin);
		return this.getPathInsideRectangle(c,this.bitWidth);
	}
	,getGCode: function(bitLength,feedrate) {
		var carvDepth = this.thickness / 5;
		var pathDogbone = this.getPathDogbone();
		var pathCentral = this.getPathCentral();
		var pathSupportPart = this.getPathSupportPart();
		var pathSupportCarving = this.getPathSupportCarving();
		var codeSupport = this.getBeginningGCode();
		var codeCentral = this.getBeginningGCode();
		codeCentral += this.cutPath(pathDogbone,-this.thickness,bitLength,feedrate);
		codeCentral += "\n";
		codeCentral += this.cutPath(pathCentral,-this.thickness,bitLength,feedrate,true);
		codeCentral += "\n" + this.getEndingGCode();
		codeSupport += this.cutPath(pathSupportCarving,-carvDepth,bitLength,feedrate);
		codeSupport += "\n";
		codeSupport += this.cutPath(pathSupportPart,-this.thickness,bitLength,feedrate,true);
		codeSupport += "\n" + this.getEndingGCode();
		return [codeCentral,codeSupport];
	}
});
var stand_StandHorizontal = function(surface,width,height,bitWidth,thickness) {
	stand_Stand.call(this,surface,width,height,bitWidth,thickness);
};
stand_StandHorizontal.__name__ = true;
stand_StandHorizontal.__super__ = stand_Stand;
stand_StandHorizontal.prototype = $extend(stand_Stand.prototype,{
	updateTotalSize: function() {
		var cSupport = this.getRealCoordinate(this.supportPart);
		var cCentral = this.getRealCoordinate(this.centralPart);
		var margin = this.bitWidth * 2;
		var realWidth = cCentral.width + 2 * margin + cSupport.width + this.bitWidth;
		var realHeight = Math.max(cCentral.height,cSupport.height);
		realHeight += this.bitWidth + margin;
		var pixelWidth = realWidth * this.surface.inToPx;
		var pixelHeight = realHeight * this.surface.inToPx;
		this.rectangleSize.x = 0;
		this.rectangleSize.y = this.surface.canvas.height - pixelHeight;
		this.rectangleSize.width = pixelWidth;
		this.rectangleSize.height = pixelHeight;
		this.horizontalSize.x = this.rectangleSize.x + this.rectangleSize.width / 2 - 5;
		this.horizontalSize.y = this.rectangleSize.y - 5;
		if(realWidth == null) this.horizontalSize.text = "null"; else this.horizontalSize.text = "" + realWidth;
		this.verticalSize.x = this.rectangleSize.x + this.rectangleSize.width + 5;
		this.verticalSize.y = this.rectangleSize.y + this.rectangleSize.height / 2 - 5;
		if(realHeight == null) this.verticalSize.text = "null"; else this.verticalSize.text = "" + realHeight;
	}
	,createElements: function() {
		stand_Stand.prototype.createElements.call(this);
		this.rectangleSize = new element_Rectangle(0,0,1,1,null,"red");
		this.horizontalSize = new element_Text(0,0,"0");
		this.verticalSize = new element_Text(0,0,"0");
		this.surface.add(this.rectangleSize);
		this.surface.add(this.horizontalSize);
		this.surface.add(this.verticalSize);
		this.placeElements();
	}
	,placeElements: function() {
		var inToPx = this.surface.inToPx;
		var cHeight = this.surface.canvas.height;
		var marginBorder = this.bitWidth * 2 * inToPx;
		var marginParts = this.bitWidth * 2.5 * inToPx;
		var xLeft = marginBorder;
		this.centralPart.x = xLeft;
		this.centralPart.y = cHeight - marginBorder - this.centralPart.height;
		this.dogbone.x = this.centralPart.x + stand_Stand.MARGIN_CENTRAL * inToPx;
		this.dogbone.y = this.centralPart.y + this.centralPart.height - 0.875 * inToPx - this.dogbone.height;
		this.supportPart.x = xLeft + marginParts + this.centralPart.width;
		this.supportPart.y = this.centralPart.y + this.centralPart.height - this.supportPart.height;
		this.supportCarving.x = this.supportPart.x;
		this.supportCarving.y = this.supportPart.y + this.supportPart.height - 0.5 * inToPx - this.supportCarving.height;
		this.updateTotalSize();
		this.surface.draw();
	}
	,getGCode: function(bitLength,feedrate) {
		var carvDepth = this.thickness / 5;
		var pathDogbone = this.getPathDogbone();
		var pathCentral = this.getPathCentral();
		var pathSupportPart = this.getPathSupportPart();
		var pathSupportCarving = this.getPathSupportCarving();
		var code = this.getBeginningGCode();
		code += this.g(0,feedrate,null,null,2) + "\n";
		code += this.cutPath(pathDogbone,-this.thickness,bitLength,feedrate) + "\n";
		code += this.cutPath(pathSupportCarving,-carvDepth,bitLength,feedrate);
		code += "\n";
		code += this.cutPath(pathCentral,-this.thickness,bitLength,feedrate,true);
		code += "\n";
		code += this.cutPath(pathSupportPart,-this.thickness,bitLength,feedrate,true);
		code += "\n";
		code += this.getEndingGCode();
		return [code];
	}
});
var stand_StandVertical = function(surface,width,height,bitWidth,thickness) {
	stand_Stand.call(this,surface,width,height,bitWidth,thickness);
};
stand_StandVertical.__name__ = true;
stand_StandVertical.__super__ = stand_Stand;
stand_StandVertical.prototype = $extend(stand_Stand.prototype,{
	updateTotalSize: function() {
		var cSupport = this.getRealCoordinate(this.supportPart);
		var cCentral = this.getRealCoordinate(this.centralPart);
		var margin = this.bitWidth * 2;
		var realWidth = cCentral.width + margin + this.bitWidth;
		var realHeight = cCentral.height + cSupport.height + 2 * margin;
		realHeight += this.bitWidth;
		var pixelWidth = realWidth * this.surface.inToPx;
		var pixelHeight = realHeight * this.surface.inToPx;
		this.rectangleSize.x = 0;
		this.rectangleSize.y = this.surface.canvas.height - pixelHeight;
		this.rectangleSize.width = pixelWidth;
		this.rectangleSize.height = pixelHeight;
		this.horizontalSize.x = this.rectangleSize.x + this.rectangleSize.width / 2 - 5;
		this.horizontalSize.y = this.rectangleSize.y - 5;
		if(realWidth == null) this.horizontalSize.text = "null"; else this.horizontalSize.text = "" + realWidth;
		this.verticalSize.x = this.rectangleSize.x + this.rectangleSize.width + 5;
		this.verticalSize.y = this.rectangleSize.y + this.rectangleSize.height / 2 - 5;
		if(realHeight == null) this.verticalSize.text = "null"; else this.verticalSize.text = "" + realHeight;
	}
	,createElements: function() {
		stand_Stand.prototype.createElements.call(this);
		this.rectangleSize = new element_Rectangle(0,0,1,1,null,"red");
		this.horizontalSize = new element_Text(0,0,"0");
		this.verticalSize = new element_Text(0,0,"0");
		this.surface.add(this.rectangleSize);
		this.surface.add(this.horizontalSize);
		this.surface.add(this.verticalSize);
		this.placeElements();
	}
	,placeElements: function() {
		var inToPx = this.surface.inToPx;
		var cHeight = this.surface.canvas.height;
		var marginBorder = this.bitWidth * 2 * inToPx;
		var marginParts = this.bitWidth * 2.5 * inToPx;
		var xLeft = marginBorder;
		this.centralPart.x = xLeft;
		this.centralPart.y = cHeight - marginBorder - this.centralPart.height;
		this.dogbone.x = this.centralPart.x + stand_Stand.MARGIN_CENTRAL * inToPx;
		this.dogbone.y = this.centralPart.y + this.centralPart.height - 0.875 * inToPx - this.dogbone.height;
		this.supportPart.x = xLeft;
		this.supportPart.y = this.centralPart.y - marginParts - this.supportPart.height;
		this.supportCarving.x = this.supportPart.x;
		this.supportCarving.y = this.supportPart.y + this.supportPart.height - 0.5 * inToPx - this.supportCarving.height;
		this.updateTotalSize();
		this.surface.draw();
	}
	,getGCode: function(bitLength,feedrate) {
		var carvDepth = this.thickness / 5;
		var pathDogbone = this.getPathDogbone();
		var pathCentral = this.getPathCentral();
		var pathSupportPart = this.getPathSupportPart();
		var pathSupportCarving = this.getPathSupportCarving();
		var code = this.getBeginningGCode();
		code += this.g(0,feedrate,null,null,2) + "\n";
		code += this.cutPath(pathDogbone,-this.thickness,bitLength,feedrate) + "\n";
		code += this.cutPath(pathSupportCarving,-carvDepth,bitLength,feedrate);
		code += "\n";
		code += this.cutPath(pathCentral,-this.thickness,bitLength,feedrate,true);
		code += "\n";
		code += this.cutPath(pathSupportPart,-this.thickness,bitLength,feedrate,true);
		code += "\n";
		code += this.getEndingGCode();
		return [code];
	}
});
var state_IState = function() { };
state_IState.__name__ = true;
var state_Custom = function(surface,widthInInch,heightInInch) {
	if(heightInInch == null) heightInInch = 0;
	if(widthInInch == null) widthInInch = 0;
	this.container = window.document.getElementById("custom");
	this.container.style.display = "inline-block";
	this.surface = surface;
	this.setWidth(widthInInch);
	this.setHeight(heightInInch);
	this.iptPxToIn = window.document.getElementById("inToPx");
	if(surface.inToPx == null) this.iptPxToIn.value = "null"; else this.iptPxToIn.value = "" + surface.inToPx;
	this.iptPxToIn.onchange = $bind(this,this.changeInToPx);
	this.explanationContainer = window.document.getElementById("explanations-custom");
	this.explanationContainer.style.display = "block";
	var toggle = window.document.getElementById("toggle-details-custom");
	toggle.onclick = $bind(this,this.toggleDetails);
};
state_Custom.__name__ = true;
state_Custom.__interfaces__ = [state_IState];
state_Custom.prototype = {
	toggleDetails: function() {
		var elt = window.document.getElementById("details-custom");
		if(elt.style.display == "none" || elt.style.display == "") elt.style.display = "block"; else elt.style.display = "none";
	}
	,create: function() {
		this.setHTMLElements();
		var wR = this.width * this.surface.inToPx;
		var hR = this.height * this.surface.inToPx;
		var x = 5;
		var y = this.surface.canvas.height - hR - 5;
		this.rectangle = new element_Rectangle(x,y,wR,hR);
		this.surface.add(this.rectangle);
	}
	,changeInToPx: function() {
		this.surface.set_inToPx(Std["int"](App.checkFloat(this.iptPxToIn,1)));
		this.setSize();
	}
	,setWidth: function(widthInInch) {
		this.width = Math.max(state_Custom.MIN_WIDTH,widthInInch);
	}
	,setHeight: function(heightInInch) {
		this.height = Math.max(state_Custom.MIN_WIDTH,heightInInch);
	}
	,destroy: function() {
		this.container.style.display = "none";
		this.explanationContainer.style.display = "none";
		this.surface.removeAll();
	}
	,setSizeSample: function(width,height) {
		if(width == null) this.iptWidth.value = "null"; else this.iptWidth.value = "" + width;
		if(height == null) this.iptHeight.value = "null"; else this.iptHeight.value = "" + height;
		this.setSize();
	}
	,setIPhone: function() {
		this.setSizeSample(3,6);
	}
	,setMusicStand: function() {
		this.setSizeSample(18,16);
	}
	,displayFinal: function() {
		App.switchState(new state_Final(this.surface,this.width,this.height));
	}
	,setSize: function() {
		this.setWidth(App.checkFloat(this.iptWidth,state_Custom.MIN_WIDTH));
		this.setHeight(App.checkFloat(this.iptHeight,state_Custom.MIN_WIDTH));
		this.rectangle.width = this.width * this.surface.inToPx;
		this.rectangle.height = this.height * this.surface.inToPx;
		this.rectangle.y = this.surface.canvas.height - this.rectangle.height - 5;
		this.surface.draw();
	}
	,setHTMLElements: function() {
		window.document.getElementById("go-finalize").onclick = $bind(this,this.displayFinal);
		this.iptWidth = window.document.getElementById("width");
		this.iptWidth.value = Std.string(this.width);
		this.iptWidth.onchange = $bind(this,this.setSize);
		this.iptHeight = window.document.getElementById("height");
		this.iptHeight.value = Std.string(this.height);
		this.iptHeight.onchange = $bind(this,this.setSize);
		window.document.getElementById("iPhone").onclick = $bind(this,this.setIPhone);
		window.document.getElementById("music-stand").onclick = $bind(this,this.setMusicStand);
	}
};
var state_Final = function(surface,width,height) {
	this.container = window.document.getElementById("finalization");
	this.container.style.display = "inline-block";
	this.surface = surface;
	this.width = width;
	this.height = height;
	this.stand = new stand_StandVertical(surface,width,height,state_Final.BIT_WIDTH,state_Final.THICKNESS);
	this.iptPxToIn = window.document.getElementById("inToPx");
	if(surface.inToPx == null) this.iptPxToIn.value = "null"; else this.iptPxToIn.value = "" + surface.inToPx;
	this.iptPxToIn.onchange = $bind(this,this.changeInToPx);
	this.explanationContainer = window.document.getElementById("explanations-final");
	this.explanationContainer.style.display = "block";
	var toggle = window.document.getElementById("toggle-details-final");
	toggle.onclick = $bind(this,this.toggleDetails);
};
state_Final.__name__ = true;
state_Final.__interfaces__ = [state_IState];
state_Final.prototype = {
	create: function() {
		this.stand.createElements();
		this.setButtons();
	}
	,toggleDetails: function() {
		var elt = window.document.getElementById("details-final");
		if(elt.style.display == "none" || elt.style.display == "") elt.style.display = "block"; else elt.style.display = "none";
	}
	,destroy: function() {
		this.container.style.display = "none";
		this.explanationContainer.style.display = "none";
		this.surface.removeAll();
	}
	,changeInToPx: function() {
		this.surface.set_inToPx(Std["int"](App.checkFloat(this.iptPxToIn,1)));
		this.setParameters();
	}
	,displayCustom: function() {
		App.switchState(new state_Custom(this.surface,this.stand.width,this.stand.height));
	}
	,setParameters: function() {
		var bitWidth = App.checkFloat(this.iptBitWidth,0);
		var thickness = App.checkFloat(this.iptThickness,0);
		App.checkFloat(this.iptBitLength,0);
		App.checkFloat(this.iptFeedrate,0);
		this.stand.setBitWidth(bitWidth);
		this.stand.setBoardThickness(thickness);
	}
	,generateCode: function() {
		var bitLength = App.checkFloat(this.iptBitLength);
		var feedrate = App.checkFloat(this.iptFeedrate);
		var codes = this.stand.getGCode(bitLength,feedrate);
		if(codes.length > 1) {
			Job.submitJob(codes[0],{ filename : "stand-central.nc"});
			Job.submitJob(codes[1],{ filename : "stand-support.nc"});
		} else Job.submitJob(codes[0],{ filename : "stand.nc"});
	}
	,setStandVertical: function() {
		this.stand = new stand_StandVertical(this.surface,this.width,this.height,App.checkFloat(this.iptBitWidth),App.checkFloat(this.iptThickness));
		this.stand.createElements();
	}
	,setStandHorizontal: function() {
		this.stand = new stand_StandHorizontal(this.surface,this.width,this.height,App.checkFloat(this.iptBitWidth),App.checkFloat(this.iptThickness));
		this.stand.createElements();
	}
	,setStandFiles: function() {
		this.stand = new stand_StandFiles(this.surface,this.width,this.height,App.checkFloat(this.iptBitWidth),App.checkFloat(this.iptThickness));
		this.stand.createElements();
	}
	,setButtons: function() {
		window.document.getElementById("go-customize").onclick = $bind(this,this.displayCustom);
		this.iptFeedrate = window.document.getElementById("feedrate");
		this.iptFeedrate.value = Std.string(state_Final.FEEDRATE);
		this.iptFeedrate.onchange = $bind(this,this.setParameters);
		this.iptThickness = window.document.getElementById("thickness");
		this.iptThickness.value = Std.string(state_Final.THICKNESS);
		this.iptThickness.onchange = $bind(this,this.setParameters);
		this.iptBitLength = window.document.getElementById("bitLength");
		this.iptBitLength.value = Std.string(state_Final.BIT_LENGTH);
		this.iptBitLength.onchange = $bind(this,this.setParameters);
		this.iptBitWidth = window.document.getElementById("bitWidth");
		this.iptBitWidth.value = Std.string(state_Final.BIT_WIDTH);
		this.iptBitWidth.onchange = $bind(this,this.setParameters);
		var iptVertical;
		iptVertical = window.document.getElementById("vertical");
		iptVertical.onchange = $bind(this,this.setStandVertical);
		iptVertical.checked = true;
		window.document.getElementById("horizontal").onchange = $bind(this,this.setStandHorizontal);
		window.document.getElementById("twoFiles").onchange = $bind(this,this.setStandFiles);
		window.document.getElementById("generate").onclick = $bind(this,this.generateCode);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.__name__ = true;
Array.__name__ = true;
stand_Stand.MARGIN_CENTRAL = 0.5;
stand_Stand.HEIGHT_SUPPORT = 3;
state_Custom.MIN_WIDTH = 3;
state_Custom.MIN_HEIGHT = 3;
state_Final.FEEDRATE = 120;
state_Final.THICKNESS = 0.25;
state_Final.BIT_LENGTH = 1;
state_Final.BIT_WIDTH = 0.25;
App.main();
})(typeof console != "undefined" ? console : {log:function(){}});
