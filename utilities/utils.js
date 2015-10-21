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
	return balance;
};