var mongoose		= require('mongoose')
	,Schema 		= mongoose.Schema;

var entrySchema = new Schema({
	entry_date : Date,
	amount : Number,
	user:{ 
		first_name : String
		,last_name:  String
		,picture_url :  String
		,active :  String},
	jar : {
		name : String
		,goal:  Number
		,expended_on : Date
		,used_on :  String
		,archived : Boolean},
	type : {
		name :  String
		,archived : Boolean}
});

var mongoConnectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://admin:r1mat0s@ds051893.mongolab.com:51893/lejar_db';
mongoose.connect(mongoConnectionString);

exports.db = mongoose.connection;
exports.Entry = mongoose.model('Entries', entrySchema);
