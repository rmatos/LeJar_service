var dateUtils = require('./date_utils.js'),
	db 		  = require('../config/db_schema');

exports.handleInvalidDate = function handlerInvalidDateErrorMessage(response){
			response({"errorMessage": "Invalid Date"});
};

exports.calculateTotalBalance = function calculateTotalBalance(entries){
	var balance = {
		total_balance_paid : 0,
		total_balance_unpaid : 0
	};
	if(entries!== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i].paid === true){
				balance.total_balance_paid += entries[i].amount;
			}else{
				balance.total_balance_unpaid += entries[i].amount;
			}
		}
	}
	console.log(balance);
	return balance;
};

exports.calculateTodaysPersonalBalance = function calculateTodaysPersronalBalance(entries, user_id){
	var todaysPersonalBalance = {
		todays_personal_balance_paid : 0,
		todays_personal_balance_unpaid : 0
	};
	if(entries !== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i] !== undefined && entries[i].entry_date >= dateUtils.todaysMinDatetime && entries[i].entry_date <= dateUtils.todaysMaxDatetime && entries[i].user.toString() === user_id.toString()){
				if(entries[i].paid === true){
					todaysPersonalBalance.todays_personal_balance_paid += entries[i].amount;
				}else{
					todaysPersonalBalance.todays_personal_balance_unpaid += entries[i].amount;
				}
			}
		}
	}
	console.log(todaysPersonalBalance);
	return todaysPersonalBalance;
};

exports.calculateTotalPersonalBalance= function calculateTotalPersonalBalance(entries, user_id){
	var totalPersonalBalance = {
		total_personal_balance_paid : 0,
		total_personal_balance_unpaid : 0
	};
	if(entries !== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i].user.toString() === user_id.toString()){
				if(entries[i].paid === true){
					totalPersonalBalance.total_personal_balance_paid += entries[i].amount;
				}else{
					totalPersonalBalance.total_personal_balance_unpaid += entries[i].amount;
				}
			}
		}
	}
	console.log(totalPersonalBalance);
	return totalPersonalBalance;
};