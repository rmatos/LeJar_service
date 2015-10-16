var env 				= process.env.NODE_ENV || 'development',
	packageJSON			= require('../package.json'),
	utils 				= require('../utilities/utils') ,
	hapi 				= require('hapi'),
	Blipp 				= require('blipp'),
	jar_entries_routes 	= require('../routes/entries'),
	amount 				= require('../routes/amounts'),
	totals 				= require('../routes/totals'),
	balance 			= require('../routes/balance'),
	users 				= require('../routes/users'),
	db					= require('./db_schema'),
	generic 			= require('../routes/generic');

console.log('Loading App in '+env+' mode.');
var server = new hapi.Server();

global.App = {
	hapiServer : server,
	blipp : Blipp,
	utility : utils,
	amounts : [25,50,75,100],
	port : process.env.PORT || 3000,
	env : env,
	version : packageJSON.version,
	dbObj : db,
	start : function(){
		App.hapiServer.connection({port:App.port , routes : {cors : true}});
		jar_entries_routes(App.hapiServer);
		amount(App.hapiServer);
		totals(App.hapiServer);
		balance(App.hapiServer);
		generic(App.hapiServer);
		users(App.hapiServer);
		App.hapiServer.register({register:App.blipp , options :{}}, function(error){
			if(error){
				console.log("Error starting hapi server with error: "+error);
			}else{
				App.hapiServer.start(function(){
					console.log('Version' + App.version +' running at: '+ App.hapiServer.info.uri + "("+new Date()+")");
				});
			}
		});
	}
};