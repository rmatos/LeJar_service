var nodemailer 	= require('nodemailer'),
	db			= require('../config/db_schema');

	
function changeLeJarMode(){
	db.ApplicationConfig.findOne(function(error, appConfig){
			if(error) return console.log(error);
			var availableModes = appConfig.application_modes;
			var currentMode = appConfig.application_current_mode;
			console.log("Current Mode: "+currentMode);
			currentMode = generateRandomMode(availableModes,currentMode);
			console.log('mode : '+currentMode);
			appConfig.application_current_mode = currentMode;
			appConfig.save(function(error){
				if(error) return console.log(error);
				console.log("New Mode updated. Application now running with on "+ currentMode +" mode");
				notifyUsers(currentMode);
			});
		});	
}

function generateRandomMode(availableModes , currentMode){
	var foundNewMode = false;
	var newMode = null;
	if(availableModes && availableModes.length > 0 && currentMode){
		while(!foundNewMode){
			var randomIndex = Math.round(Math.random() * (availableModes.length-1));
			if(availableModes[randomIndex] !== currentMode){
				newMode = availableModes[randomIndex];
				foundNewMode = true;
			}	
		}
	}

	console.log('new mode found : '+newMode);
	return newMode;
}

function notifyUsers(applicationMode){
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
		subject : 'Application Mode has been changed.',
		html 	: '<b>Application is currently running on '+applicationMode+' mode<b/>'
	};
	transporter.sendMail(mailOptions,function(error, info){
		if(error) return console.log(error);
		console.log('Message sent succesfully with message : '+info.response);
	});
}

changeLeJarMode();