const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

require('dotenv/config');

const sendMail = async (to, subject, htmlContent) => {
	try {
		const transport = nodeMailer.createTransport({
			host: mailConfig.HOST,
			port: mailConfig.PORT,
			secure: false,
			auth: {
				user: mailConfig.USERNAME,
				pass: mailConfig.PASSWORD,
			},
		});

		const options = {
			from: mailConfig.FROM_ADDRESS,
			to: to,
			subject: subject,
			html: htmlContent,
		};

		await transport.sendMail(options);
		console.log(`Email has send to: ${to}`);
	} catch (error) {
		console.log('email not sent');
		console.log(error);
	}
};

module.exports = sendMail;
