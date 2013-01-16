var fs = require('fs');
var CONF = require('../config/config.json');

exports.getWSAppServ = function(app, isSSL)
{
	var https = require('https');
	var http = require('http');
	var options = false;

	if (isSSL && CONF.SSL.enableSSL)
	{
		options = {
				  	key: fs.readFileSync(CONF.SSL.sslKey),
				  	cert: fs.readFileSync(CONF.SSL.sslCert),
				  	requestCert: true,
				  	passphrase : CONF.SSL.passphrase,
				  	ca : fs.readFileSync(CONF.SSL.sslCA)
				};
		return https.createServer(options, app);
	}
	return http.createServer(app);
};