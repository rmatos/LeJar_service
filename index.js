var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({port: process.env.PORT || 3000});


var moneyAmounts = [25,50,75,100];


//Routes
server.route({
	method:'GET',
	path:'/getAmount/random',
	handler:function(request,response){
		var randomIndex = Math.floor(Math.random() * 4);
		response({randomAmount:moneyAmounts[randomIndex]});
	}
});


server.start(function(){
	console.log('Server is currently running at: '+ server.info.uri);
})

