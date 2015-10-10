module.exports = function(server){

	server.route({
		method:'GET',
		path:'/getTotals/todays',
		handler:function(request,response){
			response(NOT_YET_IMPLEMENTED_RESPONSE);

		}
	});


	server.route({
		method:'GET',
		path:'/getTotals/total',
		handler:function(request,response){
			response(NOT_YET_IMPLEMENTED_RESPONSE);

		}
	});


	server.route({
		method:'GET',
		path:'/getTotals/maxInADay',
		handler:function(request,response){
			response(NOT_YET_IMPLEMENTED_RESPONSE);
		}
	});

};