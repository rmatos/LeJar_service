module.exports = function(server){
	server.route({
		method:'GET',
		path:'/maintenance/amount/random',
		handler:function(request,response){
			response({randomAmount:App.utility.getRandomIndexFromArray(App.amounts)});
		}
	});

	server.route({
		method:'GET',
		path:'/maintenance/amount/all',
		handler:function(request,response){
			response({validAmounts: App.amounts});
		}
	});
};

