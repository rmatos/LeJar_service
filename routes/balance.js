module.exports = function(server){

	server.route({
		method:'GET',
		path:'/getBalance/total',
		handler:function(request,response){
			response(NOT_YET_IMPLEMENTED_RESPONSE);

		}
	});

	server.route({
		method:'GET',
		path:'/getBalance/goal',
		handler:function(request,response){
			response(NOT_YET_IMPLEMENTED_RESPONSE);

		}
	});
};