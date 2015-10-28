var mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema;

var entrySchema = new Schema({
	entry_date : Date,
	amount : Number,
	paid : Boolean,
	user:{ type : Schema.Types.ObjectId, ref :'User' },
	type : String,
	approved_by:{ type : Schema.Types.ObjectId, ref : 'User'}
});


var userSchema  = new Schema({
	first_name : String,
	last_name : String,
	username :  String,
	position : String,
	is_user_maintenance : Boolean,
	is_user_approver : Boolean, 
	picture_path: String
});

var mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(mongoConnectionString);

exports.Entry = mongoose.model('Entries', entrySchema);
exports.User = mongoose.model('User', userSchema);
exports.dbConnection = mongoose.connection;


