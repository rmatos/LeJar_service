var env 				= process.env.NODE_ENV || 'development',
	packageJSON			= require('../package.json'),
	utils 				= require('../utilities/utils') ,
	hapi 				= require('hapi'),
	jar_entries_routes 	= require('../routes/jar_entries'),
	amount 				= require('../routes/amounts'),
	totals 				= require('../routes/totals'),
	balance 			= require('../routes/balance'),
	users 				= require('../routes/users'),
	db					= require('./db_schema')
	generic 			= require('../routes/generic');

console.log('Loading App in '+env+' mode.');
var server = new hapi.Server();

global.App = {
	hapiServer : server,
	utility : utils,
	port : process.env.PORT || 3000,
	env : env,
	version : packageJSON.version,
	dbObj : db,
	start : function(){
		App.hapiServer.connection({port:App.port});
		jar_entries_routes(App.hapiServer);
		amount(App.hapiServer);
		totals(App.hapiServer);
		balance(App.hapiServer);
		generic(App.hapiServer);
		users(App.hapiServer);
		App.hapiServer.start(function(){
			console.log('Hapi Server app with version' + App.version +' is currently running at: '+ App.hapiServer.info.uri);
		});
	}
};