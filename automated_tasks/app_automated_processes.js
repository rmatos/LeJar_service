var nodemailer = require('nodemailer');
	
function changeLeJarMode(){
	App.dbObj.ApplicationConfig.find(function(error, appConfig){
			if(error) return console.log(error);
			var availableModes = appConfig.application_modes;
			var currentMode = appConfig.application_current_mode;
			console.log("Current Mode: "+currentMode);
			currentMode = generateRandomMode(availableModes,currentMode);
			console.log('mode : '+currentMode);
				App.dbObj.ApplicationConfig.save(function(error, updated){
					if(error) return console.log(error);
					console.log("New Mode updated. Application now running with on "+ currentMode +" mode");
				});
		});	
}

function generateRandomMode(availableModes , currentMode){

	// console.log(availableModes);
	// console.log(currentMode);
	var foundNewMode = false;
	var newMode = null;
	if(availableModes && availableModes.length > 0 && currentMode){
		while(!foundNewMode){
			var randomIndex = Math.round(Math.random() * (availableModes.length-1));
			console.log(randomIndex);
			console.log(availableModes[randomIndex]);
			if(availableModes[randomIndex] !== currentMode){
				newMode = availableModes[randomIndex];
				foundNewMode = true;
			}	
		}
	}

	console.log('new mode found : '+newMode);
	return newMode;
}

function sendTestEmail(){
	var transporter = nodemailer.createTransport({
		service : 'Gmail',
		auth:{
			user : process.env.EMAIL_USERNAME,
			pass : process.env.EMAIL_PASSWORD
		}
	});
	var mailOptions = {
		from 	: 'le-jar-service@lejar-service.noreply.com',
		to 	 	: 'rmena28@gmail.com,rudy.e.matos@gmail.com,rudy12118@gmail.com',
		subject : 'Testing Heroku Scheduler',
		html 	: '<b> This is a test from Heroku Running an scheduler <b/>'
	};
	transporter.sendMail(mailOptions,function(error, info){
		if(error) return console.log(error);
		console.log('Message sent succesfully with message : '+info.response);
	});
}

changeLeJarMode();