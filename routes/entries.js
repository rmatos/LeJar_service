var constants 	= require('../utilities/constants'),
	utils 		= require('../utilities/utils'),
	amount 		= require('./amounts');

module.exports = function(server) {

        server.route({
        	method: 'GET',
        	path: '/entries/all',
        	handler: function(request, response) {
        		response(App.dbObj.Entry.find());
        	}
        });

        server.route({
        	method: 'GET',
        	path: '/entries/all/byUserId/{userId}',
        	handler: function(request, response) {
				var userId = request.params.userId;
				if (userId !== undefined) {
					App.dbObj.User.findOne({_id: userId }, function(error, user) {
						if (error || user === null) {
							console.log("Error getting user with ID: " + userId);
							response(constants.INVALID_USER_ID);
						} else {
							console.log("User found with the following info: " + user._id);
							App.dbObj.Entry.find({user:user._id}, function(error, entries) {
								if (error) {
									console.log("Error getting entry with message:" + error);
									response({errorCode: 400, errorMessage: error });
								} else {
									response({"results": entries});
								}
							});
						}
					});
				}
			}
        });


        server.route({
        	method: 'GET',
        	path: '/entries/todays',
        	handler: function(request, response) {
        		var todaysDate = new Date();
        		App.dbObj.Entry.find({entry_date: {"$gte": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '0', '0', '0'), "$lt": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '23', '59', '59')}},function(error, entries) {
        			if (error) {
        				console.log("Error getting entry with message:" + error);
        				response({errorCode: 400, errorMessage: error });
        			} else {
        				response({"results":entries});
        			}
        		});
        	}
        });


		server.route({
			method: 'GET',
			path: '/entries/todays/byUserId/{userId}',
			handler: function(request, response) {
				var userId = request.params.userId;
				if (userId !== undefined) {
					App.dbObj.User.findOne({_id: userId }, function(error, user) {
						if (error || user === null) {
							console.log("Error getting user with ID: " + userId);
							response(constants.INVALID_USER_ID);
						} else {
							console.log("User found with the following info: " + user._id);
							var todaysDate = new Date();
							App.dbObj.Entry.findOne({entry_date: {"$gte": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '0', '0', '0'), "$lt": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '23', '59', '59') }, user: user._id }, function(error, entries) {
								if (error) {
									console.log("Error getting entry with message:" + error);
									response({errorCode: 400, errorMessage: error });
								} else {
									response({"results": entries});
								}
							});
						}
					});
				}
			}
		});

		server.route({
			method: 'GET',
			path: '/entries/betweenDays/startingDate/{startingDate}/endingDate/{endingDate}',
			handler: function(request, response) {
				var startingDateString = request.params.startingDate;
				var endingDateString = request.params.endingDate;
				if(startingDateString !== undefined && endingDateString !== undefined){
					startingDateString = startingDateString.replace("-","/");
					var currentStartingDate = new Date(Date.parse(startingDateString));
				 	endingDateString = endingDateString.replace("-","/");
					var	currentEndingDate = new Date(Date.parse(endingDateString));
					if(currentStartingDate !== 'NaN' && currentEndingDate !== 'NaN' && currentStartingDate <= currentEndingDate){
						App.dbObj.Entry.find({entry_date : {"$gte": new Date(currentStartingDate.getFullYear(), currentStartingDate.getMonth(), currentStartingDate.getDate(), '0', '0', '0'), "$lt": new Date(currentEndingDate.getFullYear(), currentEndingDate.getMonth(), currentEndingDate.getDate(), '23', '59', '59') }}, function(error, entries){
							if (error) {
								console.log("Error getting entry with message:" + error);
								response({errorCode: 400, errorMessage: error });
							} else {
								response({"results": entries});
							}
						});
					}else{
						handlerInvalidDateErrorMessage(response);
					}
				}else{
					handlerInvalidDateErrorMessage(response);
				}
			}
		});

		server.route({
			method: 'GET',
			path: '/entries/betweenDays/startingDate/{startingDate}/endingDate/{endingDate}/byUserId/{userId}',
			handler: function(request, response) {
				var startingDateString 	= request.params.startingDate;
				var endingDateString 	= request.params.endingDate;
				var userId 				= request.params.userId;
				if(userId !== undefined){
					App.dbObj.User.findOne({_id: userId }, function(error, user) {
						if (error || user === null) {
							console.log("Error getting user with ID: " + userId);
							response(constants.INVALID_USER_ID);
						} else {
							if(startingDateString !== undefined && endingDateString !== undefined){
								startingDateString = startingDateString.replace("-","/");
								var currentStartingDate = new Date(Date.parse(startingDateString));
					 			endingDateString = endingDateString.replace("-","/");
								var	currentEndingDate = new Date(Date.parse(endingDateString));
								if(currentStartingDate !== 'NaN' && currentEndingDate !== 'NaN' && currentStartingDate <= currentEndingDate){
									App.dbObj.Entry.find({entry_date : {"$gte": new Date(currentStartingDate.getFullYear(), currentStartingDate.getMonth(), currentStartingDate.getDate(), '0', '0', '0'), "$lt": new Date(currentEndingDate.getFullYear(), currentEndingDate.getMonth(), currentEndingDate.getDate(), '23', '59', '59') }, user : user._id}, function(error, entries){
										if (error) {
											console.log("Error getting entry with message:" + error);
											response({errorCode: 400, errorMessage: error });
										} else {
											response({"results": entries});
										}
									});
								}else{
									handlerInvalidDateErrorMessage(response);
								}
							}else{
								handlerInvalidDateErrorMessage(response);
							}
						}
					});
				}else{
					response(constants.INVALID_USER_ID);
				}
			}
		});

		server.route({
			method: 'POST',
			path: '/entries/add/',
			handler: function(request, response) {

				var userId 					= request.payload.user_id;
				var wasPaid 				= request.payload.was_paid;
				var amountForMaintenance 	= request.payload.maintenance_amount;

				if(wasPaid === undefined){
					wasPaid = false;
				}

				if (userId !== undefined) {
					App.dbObj.User.findOne({_id: userId }, function(error, user) {
						if (error || user === null) {
							response(constants.INVALID_USER_ID);
						} else {
							if(user.username === constants.MAINTENANCE_USERNAME){
								
								if(amountForMaintenance !== undefined && amountForMaintenance > 0){
									var entryToSave = App.dbObj.Entry({entry_date: new Date(), amount: amountForMaintenance, paid : true, user: user._id, type: constants.ENTRY_TYPE_MAINTENANCE});
									entryToSave.save(function(error) {
										if (error) {
											response({errorCode: 400, errorMessage: error });
										} else {
											response(constants.RECORD_CREATED_SUCCESSFULLY);
										}
									});
								}else{
									response({message: "Invalid amount for Maintenance"});
								}
							}else{	
								var todaysDate = new Date();
								App.dbObj.Entry.findOne({entry_date: {"$gte": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '0', '0', '0'), "$lt": new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(), '23', '59', '59') }, user: user._id }, function(error, entry) {
									if (error) {
										response({errorCode: 400, errorMessage: error });
									} else {
										console.log(entry);
										if (entry !== null) {
											response(constants.RECORD_ALREADY_CREATED);
										} else {
											var entryToSave = App.dbObj.Entry({entry_date: new Date(), amount: utils.getRandomIndexFromArray(App.amounts), paid : wasPaid, user: user._id, type: constants.ENTRY_TYPE_NORMAL});
											entryToSave.save(function(error) {
												if (error) {
													response({errorCode: 400, errorMessage: error });
												} else {
													response(constants.RECORD_CREATED_SUCCESSFULLY);
												}
											});
										}
									}
								});
							}
						}
					});
				} else {
					response(constants.INVALID_USER_ID);
				}
			}
		});

		function handlerInvalidDateErrorMessage(response){
			response({"errorMessage": "Invalid Date"});
		}

};