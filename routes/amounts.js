var moneyAmounts = [25,50,75,100];

module.exports = function(server){
	server.route({
		method:'GET',
		path:'/amount/random',
		handler:function(request,response){
			response({randomAmount:App.utility.getRandomIndexFromArray(moneyAmounts)});
		}
	});

	server.route({
		method:'GET',
		path:'/amount/all',
		handler:function(request,response){
			response({validAmounts: moneyAmounts});
		}
	});
}