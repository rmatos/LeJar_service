var constants 		= require('../utilities/constants'),
utils 			= require('../utilities/utils'),
amount 			= require('./amounts');


module.exports = function(server){
	server.route({
		method : 'GET',
		path: '/entries/all',
		handler : function(request, response){
			response(App.dbObj.Entry.find());
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
		method : 'GET',
		path: '/entries/add/{userId}',
		handler: function(request, response){
			var userId = request.params.userId;
			if(userId !== 'undefined'){
				App.dbObj.User.findOne({_id:userId}, function(error, user){
					if(error || user === null){ 
						console.log("Error getting user with ID: "+userId); 
						response(constants.INVALID_USER_ID);
					}else{
						console.log("User found with the following info: "+user._id);
						var todaysDate = new Date();
						App.dbObj.Entry.findOne({entry_date : 
							{"$gte" : new Date(todaysDate.getFullYear(),todaysDate.getMonth(), todaysDate.getDate(), '0','0','0'),
							"$lt" : new Date(todaysDate.getFullYear(),todaysDate.getMonth(), todaysDate.getDate(), '23','59','59')}, user : user._id},function(error, entry){
								if(error){
									console.log("Error getting entry with message:"+ error); 
									response({errorCode:400,errorMessage:error});
								}else{
									console.log(entry);
									if(entry !== null){
										console.log("There is already an entry for this user today"); 
										response(constants.RECORD_ALREADY_CREATED);	
									}else{
										var entryToSave = App.dbObj.Entry({
											entry_date : new Date(),
											amount : utils.getRandomIndexFromArray(App.amounts),
											user : user._id,
											type : 'normal'
										});
										entryToSave.save(function(error){
											if(error){
												console.log("Error getting entry with message:"+ error); 
												response({errorCode:400,errorMessage:error});
											}else{
												response({message:constants.RECORD_CREATED_SUCCESSFULLY});	
											}
											
										});
									}
								}
							});
}		
});
}else{
	response(constants.INVALID_USER_ID);
} 
}	
});
};