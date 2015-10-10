var mongoose		= require('mongoose'),
	Schema 		= mongoose.Schema;

var entrySchema = new Schema({
	entry_date : Date,
	amount : Number,
	user:{ type : Schema.Types.ObjectId, ref :'User' },
	type : String,
	jar : {type : Schema.Types.ObjectId, ref : 'Jar'}
});


var jarSchema = new Schema({
	name : String,
	submitted_timestamp : Date,
	closed_timestamp : Date,
	is_currently_active : Boolean,
	balance : Number
});

var userSchema  = new Schema({
	first_name : String,
	last_name : String,
	username :  String,
	position : String,
	picture_path: String
});

var mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(mongoConnectionString);

exports.db = mongoose.connection;
exports.Entry = mongoose.model('Entries', entrySchema);
exports.User = mongoose.model('User', userSchema);
exports.Jar = mongoose.model('Jar', jarSchema);
