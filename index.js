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
var NOT_YET_IMPLEMENTED_RESPONSE = {errorMessage: "Method not yet implemented"};

//Amount Routes
server.route({
	method:'GET',
	path:'/amount/random',
	handler:function(request,response){
		response({randomAmount:getRandomAmount()});
	}
});

server.route({
	method:'GET',
	path:'/amount/all',
	handler:function(request,response){
		response({validAmounts: moneyAmounts});
	}
});


//Entries Routes
server.route({
	method : 'GET',
	path: '/entries/all',
	handler : function(request, response){
		response(Entry.find());
	}

});

server.route({
	method : 'GET',
	path: '/entries/todays',
	handler : function(request, response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);
	}
});


server.route({
	method : 'GET',
	path: '/entries/byUserId/{id}',
	handler : function(request, response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);
	}
});


server.route({
	method : 'GET',
	path: '/entries/byDay/{date}',
	handler : function(request, response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);
	}
});

server.route({
	method : 'GET',
	path: '/entries/betweenDays/{startingDay}/{endingDay}',
	handler : function(request, response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);
	}
});

//TOTALs

server.route({
	method:'GET',
	path:'/getTotals/todays',
	handler:function(request,response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);

	}
});


server.route({
	method:'GET',
	path:'/getTotals/total',
	handler:function(request,response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);

	}
});


server.route({
	method:'GET',
	path:'/getTotals/maxInADay',
	handler:function(request,response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);
	}
});


server.route({
	method:'GET',
	path:'/getBalance/total',
	handler:function(request,response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);

	}
})

server.route({
	method:'GET',
	path:'/getBalance/goal',
	handler:function(request,response){
		response(NOT_YET_IMPLEMENTED_RESPONSE);

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

