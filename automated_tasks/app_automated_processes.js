var nodemailer = require('nodemailer');
	
function changeLeJarMode(){
	App.dbObj.ApplicationConfig.find(function(error, appConfig){
		console.log(appConfig);
	});
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