module.exports = function(server){

	server.route({
		method:'GET',
		path:'/',
		handler:function(request,response){
			response("Welcome to LeJar Backend Service. Hello Jar!");
		}
	});

};