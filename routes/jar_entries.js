var constants 		= require('../utilities/constants.js'),
	db    			= require('../config/db_schema.js');

module.exports = function(server){
	server.route({
		method : 'GET',
		path: '/entries/all',
		handler : function(request, response){
			response(db.Entry.find());
		}
	});

	server.route({
		method : 'GET',
		path: '/entries/todays',
		handler : function(request, response){
			response(constants.NOT_YET_IMPLEMENTED_RESPONSE);
		}
	});

	server.route({
		method : 'GET',
		path: '/entries/byUserId/{id}',
		handler : function(request, response){
			response(constants.NOT_YET_IMPLEMENTED_RESPONSE);
		}
	});

	server.route({
		method : 'GET',
		path: '/entries/byDay/{date}',
		handler : function(request, response){
			response(constants.NOT_YET_IMPLEMENTED_RESPONSE);
		}
	});

	server.route({
		method : 'GET',
		path: '/entries/betweenDays/{startingDay}/{endingDay}',
		handler : function(request, response){
			response(constants.NOT_YET_IMPLEMENTED_RESPONSE);
		}
	});

	server.route({
		method : 'POST',
		path: '/entries/add',
		handler: function(request, response){
			var currentEntry = new db.Entry({
				entry_date : new Date(),
				amount : request.payload.amount,
				user : {first_name : request.payload.first_name , last_name : request.payload.last_name , picture_url : request.payload.picture_url, active : true},
				jar : {name : request.payload.jar_name, goal : request.payload.goal, expended_on:null, used_on:null, archived:false},
				type: {name : request.payload.entry_type , archived: false}
			});
			currentEntry.save(function(error){
				if(error) return handlerError(error);
			});
			response({response:200});
		}
	});


};