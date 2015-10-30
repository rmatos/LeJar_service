var dateUtil 	= require('./date_utils.js'),
	constants 	= require('./constants.js'),
	db 	     	= require('../config/db_schema');


exports.generateEntryBasedOnCurrentAppMode = function generateEntryBasedOnCurrentAppMode(amounts,user, response){
	var amount = 0;
	db.ApplicationConfig.findOne(function(error, appConfig){
		if(error) return console.log(error);		
		if(appConfig && appConfig.application_current_mode){
			var mode = appConfig.application_current_mode;
			if(mode === 'normal'){
				generateAmountFromAmountArray(amounts,user, 'normal',response);
			}else if(mode === 'ledder'){
				ledderMode(user,response);
			}else if(mode === 'sudden_death'){
				suddenDeath(amounts, user,response);	
			}else{
				pacificMode(user,response);
			}	
		}else{
				response({"errorMessage" : "Application Mode cannot be found. Entry was not generated"});
		}
	});
};

function saveEntity(amount, user, mode,response){
	if(amount > 0){
		var entryToSave = App.dbObj.Entry({entry_date: dateUtil.todaysDate, amount: amount, paid : false, user: user._id, type: constants.ENTRY_TYPE_NORMAL, generated_on_mode : mode});
		// entryToSave.save(function(error) {
		// 	if (error) {
		// 		response({errorCode: 400, errorMessage: error });
		// 	} else {
				response({"random_amount" : amount});
		// 	}
		// });
	}else{
		response({"errorMessage" : "There was an error generating the amount."});
	}
}

function ledderMode(user,response){
	var amount 	 	= 0,
		minMonday 	= dateUtil.getMinForDate(dateUtil.getMonday(dateUtil.todaysDate)),
		maxFriday 	= dateUtil.getMaxForDate(dateUtil.getFridayBasedOnMonday(minMonday));
	
	db.Entry.find({"user" : user._id, "entry_date" : {"$gte" : minMonday, "$lte" : maxFriday}},function(error , entries){
		if(error) response({"errorMessage":error});
		console.log(entries);
		if(entries.length === 0){
			amount = 25;
		}else if(entries.length >= 1 && entries.length <= 3){
			amount = (entries.length + 1) * 25;
		}else{
			amount = 100;
		}
		saveEntity(amount,user,'ledder',response);
	});
}

function suddenDeath(validAmountsArray, user, response){
	var minMonday 	= dateUtil.getMinForDate(dateUtil.getMonday(dateUtil.todaysDate)),
		maxFriday 	= dateUtil.getMaxForDate(dateUtil.getFridayBasedOnMonday(minMonday));
	db.Entry.find({"user" : user._id, "entry_date" : {"$gte" : minMonday, "$lte" : maxFriday}}, {"_id" : false, "amount" : true},function(error , currentEntriesAmounts){
		if(error) response({"errorMessage":error});		
		var validAmountsArray_Copy = validAmountsArray.slice();
		currentEntriesAmounts.forEach(function(currentEntryAmount){
			var valueIndex = validAmountsArray_Copy.indexOf(currentEntryAmount.amount);
			if( valueIndex !== -1){
				validAmountsArray_Copy.splice(valueIndex, 1);
			}
		});
		if(validAmountsArray_Copy.length === 0){
			validAmountsArray_Copy = validAmountsArray.slice();
		}
		generateAmountFromAmountArray(validAmountsArray_Copy,user, 'sudden_death',response);
	});
}

function pacificMode(user,response){
	var amount = 0;
	console.log(dateUtil.todaysDate);
	var currentHour = dateUtil.todaysDate.getHours();
	var currentMinutes = dateUtil.todaysDate.getMinutes();
	console.log("current hour" +currentHour);
	console.log("current minute " +currentMinutes);
	if(currentHour >= 0 && currentMinutes >= 11){
		if(currentMinutes >= 11 && currentMinutes <= 20){
			amount = 25;
		}else if(currentMinutes >= 21 && currentMinutes <=30){
			amount = 50;
		}else if(currentMinutes >= 31 && currentMinutes <= 45){
			amount = 75;
		}else{
			amount = 100;
		}
	}
	saveEntity(amount,user, 'pacific',response);
}

function generateAmountFromAmountArray(amounts,user,mode,response){
	var amount = 0;
	var randomIndex = Math.floor(Math.random() * amounts.length);
	amount = amounts[randomIndex];
	saveEntity(amount,user,mode,response);
}