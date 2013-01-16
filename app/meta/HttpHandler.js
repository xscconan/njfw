var lang = require("../lang/cn/lang.json");

var HttpHandler = exports.HttpHandler = function(){
	this.assigedViewData = {};
};

HttpHandler.prototype.handleRequest = function(req, res, callbackFun){
	this.assigedViewData.lang = lang;
	this.onHandle();
	console.log(this.assigedViewData);
	callbackFun(this.assigedViewData);
};

HttpHandler.prototype.onHandle = function(req, res){ return null };