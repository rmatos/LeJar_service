exports.getRandomIndexFromArray = function getRandomIndexFromArray(array){
	var randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};