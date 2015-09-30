var Hapi = require('hapi');
var mongoose  = require('mongoose')
var Schema = mongoose.Schema;

//Creating Schemas for Entries
var entrySchema = new Schema({
	entry_date : Date,
	amount : Number,
	user:{ first_name : String, last_name:  String, picture_url :  String, active :  String},
	jar : {name : String, goal:  Number, expended_on : Date, used_on :  String, archived : Boolean},
	type : {name :  String, archived : Boolean}
});
var Entry = mongoose.model('Entries', entrySchema);


//Connection to MongoDB 
var mongoConnectionString = process.env.MONGO_CONNECTION_STRING
mongoose.connect(mongoConnectionString);
var db = mongoose.connection;

//Auxiliar var
var moneyAmounts = [25,50,75,100];

//Creating hapi server
var server = new Hapi.Server();
server.connection({port: process.env.PORT || 3000});

//Auxiliar functions
function getRandomAmount(){
	var randomIndex = Math.floor(Math.random() * 4);
	return moneyAmounts[randomIndex];
}


//Routes
server.route({
	method:'GET',
	path:'/getAmount/random',
	handler:function(request,response){
		response({randomAmount:getRandomAmount()});
	}
});

server.route({
	method : 'GET',
	path: '/entry/getAll',
	handler : function(request, response){
		response(Entry.find());
	}

})

server.route({
	method : 'POST',
	path: '/entry/add',
	handler: function(request, response){
		var currentEntry = new Entry({
			entry_date : new Date(),
			amount : request.payload.amount,
			user : {first_name : request.payload.first_name , last_name : request.payload.last_name , picture_url : request.payload.picture_url, active : true},
			jar : {name : request.payload.jar_name, goal : request.payload.goal, expended_on:null, used_on:null, archived:false},
			type: {name : request.payload.entry_type , archived: false}
		});
		currentEntry.save();
		response({response:200});
	}
});


server.route({
	method:'GET',
	path:'/',
	handler:function(request,response){
		response("Welcome to LeJar Backend Service. Hello Jar!");
	}
});


server.start(function(){
	console.log('Server is currently running at: '+ server.info.uri);
})

