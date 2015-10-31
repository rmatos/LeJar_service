var constants 		= require('../utilities/constants.js');

module.exports = function(server){
	server.route({
		method:'POST',
		path: '/users/add',
		handler:function(request,response){
			var newUser = App.dbObj.User({
				first_name : request.payload.first_name,
				last_name : request.payload.last_name,
				username :  request.payload.username,
				position : request.payload.position,
				picture_path: request.payload.picture_path
			});
			if(newUser && newUser.first_name && newUser.last_name){
				App.dbObj.User.findOne({first_name : newUser.first_name,last_name : newUser.last_name}).
				exec(function(error, person){
					if(error){console.log("Error gettting the user"); throw error;}
					if(person){
						response({message:constants.USER_ALREADY_FOUND_IN_DB});
					}else{
						newUser.save(function(error){
							if(error){console.log("Error saving the user"); throw error;}
							response({message:constants.USER_CREATED_SUCCESSFULLY});
						});
					}
				});
			}else{
				response({message : constants.INVALID_FIRST_OR_LAST_NAME});
			}
		}
	});

	server.route({
		method:'GET',
		path: '/users/all',
		handler:function(request,response){			
			App.dbObj.User.find().exec(function(error, users){
				if(error){
					console.log("Error gettting the user"); 
					response({"errorMessage": "Error getting users with message: "+error});
				}else{
					response(users);
				}
			});
		}
	});
};