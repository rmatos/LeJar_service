var todaysDate = new Date();
var todaysMinDatetime = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(),'0','0','0');
var todaysMaxDatetime = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate(),'23','59','59');

exports.getRandomIndexFromArray = function getRandomIndexFromArray(array){
	var randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

exports.handleInvalidDate = function handlerInvalidDateErrorMessage(response){
			response({"errorMessage": "Invalid Date"});
};

exports.calculateTotalBalance = function calculateTotalBalance(entries){
	var balance = {
		totalBalancePaid : 0,
		totalBalanceUnpaid : 0
	};
	if(entries!== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i].paid === true){
				balance.totalBalancePaid += entries[i].amount;
			}else{
				balance.totalBalanceUnpaid += entries[i].amount;
			}
		}
	}
	console.log(balance);
	return balance;
};

exports.calculateTodaysPersonalBalance = function calculateTodaysPersronalBalance(entries, user_id){
	var todaysPersonalBalance = {
		todaysPersonalBalancePaid : 0,
		todaysPersonalBalanceUnpaid : 0
	};
	if(entries !== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i] !== undefined && entries[i].entry_date >= todaysMinDatetime && entries[i].entry_date <= todaysMaxDatetime && entries[i].user.toString() === user_id.toString()){
				if(entries[i].paid === true){
					todaysPersonalBalance.todaysPersonalBalancePaid += entries[i].amount;
				}else{
					todaysPersonalBalance.todaysPersonalBalanceUnpaid += entries[i].amount;
				}
			}
		}
	}
	console.log(todaysPersonalBalance);
	return todaysPersonalBalance;
};

exports.calculateTotalPersonalBalance= function calculateTotalPersonalBalance(entries, user_id){
	var totalPersonalBalance = {
		totalPersonalBalancePaid : 0,
		totalPersonalBalanceUnpaid : 0
	};
	if(entries !== undefined && entries.length > 0){
		for (var i = 0; i <= entries.length -1 ; i++) {
			if(entries[i].user.toString() === user_id.toString()){
				console.log("entering here");
				if(entries[i].paid === true){
					totalPersonalBalance.totalPersonalBalancePaid += entries[i].amount;
				}else{
					totalPersonalBalance.totalPersonalBalanceUnpaid += entries[i].amount;
				}
			}
		}
	}
	console.log(totalPersonalBalance);
	return totalPersonalBalance;
};