module.exports = function(server){
	server.route({
		method:'GET',
		path:'/amount/random',
		handler:function(request,response){
			response({randomAmount:App.utility.getRandomIndexFromArray(App.amounts)});
		}
	});

	server.route({
		method:'GET',
		path:'/amount/all',
		handler:function(request,response){
			response({validAmounts: App.amounts});
		}
	});
};

