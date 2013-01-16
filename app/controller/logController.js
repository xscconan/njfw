var winston = require('winston');
var CONFIG = require('../config/config.json');

var config = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    debug: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

winston.Logger.prototype.write = function(level, msg){
	if (!!config.levels[level])
	{
		var i = 2;
		var _arg = arguments;
     	var msg = _arg[1].replace(/%s/g, function(){
        	return _arg[i++];
      	});
     	this[level](msg);
	} 
};

exports.init = function(){
  if (!CONFIG.Log.enableOutputConsole && !CONFIG.Log.fileLog.enable)
    return;

  var _transports = [];
  if (CONFIG.Log.enableOutputConsole) {
      _transports.push(
        new (winston.transports.Console)({
            level: 'debug',
            colorize: true
       })
      );
  };

  if (CONFIG.Log.fileLog.enable) {
      _transports.push(
        new (winston.transports.File)({
            levels: config.levels,
            filename: CONFIG.Log.wsLogPath,
            json: false, 
            maxsize: CONFIG.Log.maxSizeInMBitOfLogfile * 1024 * 1024 
        }) 
      );
  };

	global.Log = new (winston.Logger)({
	    exitOnError: false, //don't crash on exception
	    transports: _transports
	});
}