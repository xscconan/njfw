var cluster = require('cluster');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

var logCtr = require('../controller/logController.js');
var sysUtils = require('../util/sysUtils.js');
var CONF = require('../config/config.json');
var ROUTER_ARRAY = require('../config/router.json');

var numCPUs = require('os').cpus().length;

//For http web service
var _startHttpListen = function(){
	//configure for http listener
	app.configure(function(){
		app.set('views', __dirname + '/../viewTmp');
		app.set('view engine', 'jade');
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.static(__dirname  + '/../public'));
		app.use(app.router);
		app.use(express.favicon(__dirname  + '/../public/favicon.ico'));
	});

	//init express router
	for (_router in ROUTER_ARRAY)
	{
		var file = path.resolve(__dirname,'./webPageController/')+ "/"+ _router +'Controller.js';

		if (fs.existsSync(file))
		{
			var Handler = require(file);
			_httpHandle = new Handler.HttpHandler();

			var _method = ROUTER_ARRAY[_router].method;

			app[_method](ROUTER_ARRAY[_router].path, function(req, res){
				_httpHandle.handleRequest(req, res, function(_assigedViewData){
					res.render(_router + '.jade', _assigedViewData);
				});
			});
			
		}
	}

	var appHttp = sysUtils.getWSAppServ(app, false);
	var port = !!process.env.PORT ? process.env.PORT : CONF.wsPort;

	appHttp.listen(port);
};

exports.start = function(){
	if (CONF.enableCluster && cluster.isMaster) {
	  // Fork workers.
	  for (var i = 0; i < numCPUs; i++) {
	    cluster.fork();
	  }

	  cluster.on('exit', function(worker, code, signal) {
	    console.log('worker ' + worker.process.pid + ' died');
	  });
	} else {
		logCtr.init();
		_startHttpListen();
		console.log("Http Server Started, Worker id: " + process.pid);
	}
};

