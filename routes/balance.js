var constants 	= require('constants'),
	utils 		= require('../utilities/utils');

module.exports = function(server){

	server.route({
		method:'GET',
		path:'/balance/total',
		handler:function(request,response){
			App.dbObj.Entry.find().exec(function(error, entries){
				if(error){
					console.log("Error getting entries with error: "+error);
					response({"errorMessage":error});
				}else{
					var sum = 0;
					for(var i = 0; i < entries.length ; i++){
						sum += entries[i].amount;
					}
					response({"balance":sum});
				}
			});
		}
	});

	server.route({
		method:'GET',
		path:'/balance/todays',
		handler:function(request,response){
			var todaysDate = new Date();
			App.dbObj.Entry.find({entry_date:  {"$gte" : new  Date(todaysDate.getFullYear(),todaysDate.getMonth(),todaysDate.getDate(),'0','0','0') ,"$lt" : new  Date(todaysDate.getFullYear(),todaysDate.getMonth(),todaysDate.getDate(),'23','59','59')}}).exec(function(error, entries){
				if(error){
					console.log("Error getting entries with error: "+error);
					response({"errorMessage":error});
				}else{
					var paidBalance = 0;
					var unpaidBalance = 0;
					for(var i = 0; i < entries.length ; i++){
						if(entries[i].paid){
							paidBalance += entries[i].amount;
						}else{
							unpaidBalance += entries[i].amount;
						}
					}
					response({"paid_balance":paidBalance,"unpaid_balance":unpaidBalance});
				}
			});
		
		}
	});

	server.route({
		method:'GET',
		path:'/balance/todays/byUserId/{userId}',
		handler:function(request,response){
			var userId 				= request.params.userId;
			var todaysDate 			= new Date();
			App.dbObj.User.findOne({_id:userId}, function(error, user){
				if(error){
						console.log("Error getting user with error: "+error);
						response({"errorMessage":error});
				}else{
					App.dbObj.Entry.find({entry_date:  {"$gte" : new  Date(todaysDate.getFullYear(),todaysDate.getMonth(),todaysDate.getDate(),'0','0','0') ,"$lt" : new  Date(todaysDate.getFullYear(),todaysDate.getMonth(),todaysDate.getDate(),'23','59','59')}, user:user._id}).exec(function(error, entries){
						if(error){
							console.log("Error getting entries with error: "+error);
							response({"errorMessage":error});
						}else{
							if(user.username === constants.MAINTENANCE_USERNAME){
								var sum = 0;
								for(var i = 0; i < entries.length ; i++){
									sum += entries[i].amount;
								}
								response({"todays_maintenance_balance":sum});
							}else{
								response({"todays_balance" : entries[0].amount, "paid": entries[0].paid});
							}
						}
					});
				}
			});
		}
	});

	server.route({
		method:'GET',
		path:'/balance/betweenDates/startingDate/{startingDate}/endingDate/{endingDate}',
		handler:function(request,response){
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
							var paidBalance = 0;
							var unpaidBalance = 0;
							for(var i = 0; i < entries.length ; i++){
								if(entries[i].paid){
									paidBalance += entries[i].amount;
								}else{
									unpaidBalance += entries[i].amount;
								}
							}
							response({"paid_balance":paidBalance,"unpaid_balance":unpaidBalance});
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
		path: '/balance/betweenDates/startingDate/{startingDate}/endingDate/{endingDate}/byUserId/{userId}',
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
										var paidBalance = 0;
										var unpaidBalance = 0;
										for(var i = 0; i < entries.length ; i++){
											if(entries[i].paid){
												paidBalance += entries[i].amount;
											}else{
												unpaidBalance += entries[i].amount;
											}
										}
										response({"paid_balance":paidBalance,"unpaid_balance":unpaidBalance});
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

 };