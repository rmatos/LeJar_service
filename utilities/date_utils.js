
var offset = 240 * 60 * 1000;

exports.todaysDate = new Date(new Date(new Date().getTime()-offset));
exports.todaysMinDatetime = new Date(exports.todaysDate.getFullYear(), exports.todaysDate.getMonth(), exports.todaysDate.getDate(),'0','0','0');
exports.todaysMaxDatetime = new Date(exports.todaysDate.getFullYear(), exports.todaysDate.getMonth(), exports.todaysDate.getDate(),'23','59','59');

exports.getMonday = function getMonday(d) {
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6:1);
  return new Date(d.setDate(diff));
};

exports.getFridayBasedOnMonday = function getFridayBasedOnMonday(monday){
	var friday  = new Date(new Date().setDate(monday.getDate()+4));
	return friday;
};

exports.getMaxForDate = function getMaxForDate(date){
	return new Date(date.getFullYear(),date.getMonth(),date.getDate(), '23','59','59');
};

exports.getMinForDate = function getMinForDate(date){
	return new Date(date.getFullYear(),date.getMonth(),date.getDate(), '0','0','0');

};