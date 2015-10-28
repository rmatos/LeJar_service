var constants 	= require('../utilities/constants'),
	utils 		= require('../utilities/utils'),
	dbui   		= require('../jojos/dashboard_by_user_id');

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
        	path: '/entries/dashboard/byUserId/{userId}',
        	handler: function(request, response) {
				var userId = request.params.userId;
				var currentDBUI = dbui.DashboardCE;
				if (userId !== undefined) {
					App.dbObj.User.findOne({_id: userId }, function(error, user) {
						if (error || user === null) {
							console.log("Error getting user with ID: " + userId);
							response(constants.INVALID_USER_ID);
						} else {
							App.dbObj.Entry.find({}, function(error, entries) {
								if (error) {
									console.log("Error getting entry with message:" + error);
									response({errorCode: 400, errorMessage: error });
								} else {
									var balance = utils.calculateTotalBalance(entries);
									var todPB = utils.calculateTodaysPersonalBalance(entries, user._id);
									var totPB = utils.calculateTotalPersonalBalance(entries,user._id);
									currentDBUI.name = user.first_name + " "+user.last_name;
									currentDBUI.total_balance_paid = balance.total_balance_paid;
									currentDBUI.total_balance_unpaid = balance.total_balance_unpaid;
									currentDBUI.todays_personal_balance_paid = todPB.todays_personal_balance_paid;
									currentDBUI.todays_personal_balance_unpaid = todPB.todays_personal_balance_unpaid;
									currentDBUI.total_personal_balance_paid = totPB.total_personal_balance_paid;
									currentDBUI.total_personal_balance_unpaid = totPB.total_personal_balance_unpaid;
									response(currentDBUI);
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
        		console.log(todaysDate);
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
			path: '/entries/betweenDates/startingDate/{startingDate}/endingDate/{endingDate}',
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
						utils.handleInvalidDate(response);
					}
				}else{
					utils.handleInvalidDate(response);
				}
			}
		});

		server.route({
			method: 'GET',
			path: '/entries/betweenDates/startingDate/{startingDate}/endingDate/{endingDate}/byUserId/{userId}',
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
									utils.handleInvalidDate(response);
								}
							}else{
								utils.handleInvalidDate(response);
							}
						}
					});
				}else{
					response(constants.INVALID_USER_ID);
				}
			}
		});

		server.route({
			method: 'GET',
			path: '/entries/add/byUserId/{user_id}/{maintenance_amount?}',
			handler: function(request, response) {

				var userId 					= request.params.user_id;
				var amountForMaintenance 	= request.params.maintenance_amount;

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
											var amount = utils.getRandomIndexFromArray(App.amounts);
											var entryToSave = App.dbObj.Entry({entry_date: new Date(), amount: amount, paid : false, user: user._id, type: constants.ENTRY_TYPE_NORMAL});
											entryToSave.save(function(error) {
												if (error) {
													response({errorCode: 400, errorMessage: error });
												} else {
													response({"random_amount" : amount});
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

		server.route({
			method: 'PUT',
			path: '/entries/paid/byEntryId/{entry_id}/approvedByUserId/{user_id}',
			handler: function(request, response) {
				var entryId = request.params.entry_id;
				var userId 	=request.params.user_id;
				if (entryId !== undefined && userId !== undefined) {
					App.dbObj.User.findOne({_id:userId}, function(error, approver){
						if(error || approver === null){
							response({error_message : "Invalid user id"});
						}else{
							App.dbObj.Entry.findOne({_id: entryId }, function(error, entry) {
								if (error || entry === null) {
									response(constants.INVALID_ENTRY_ID);
								} else {
									if(approver.is_user_approver){
										if(entry.user.toString() !== approver._id.toString()){
											entry.paid = true;
											entry.approved_by = approver._id;
											entry.save(function(error) {
												if (error) {
													response({errorCode: 400, errorMessage: error });
												} else {
													response(constants.RECORD_UPDATED_SUCCESSFULLY);
												}
											});
										}else{
											response({errorMessage: "Approver cannot approve his own entry"});
										}
									}else{
										response({errorMessage: "User is not an approver"});
									}
								}
							});
						}
					});
				} else {
					response(constants.INVALID_USER_ID);
				}
			}
		});

		server.route({
			method: 'DELETE',
			path: '/entries/cancel/byEntryId/{entry_id}',
			handler: function(request, response) {
				var entryId 					= request.params.entry_id;
				if (entryId !== undefined) {
					App.dbObj.Entry.findOneAndRemove({_id: entryId }, function(error, entry) {
						if (error || entry === null) {
							response(constants.INVALID_ENTRY_ID);
						} else {
							response(constants.RECORD_REMOVED_SUCCESSFULLY);
						}
					});
				} else {
					response(constants.INVALID_USER_ID);
				}
			}
		});

};