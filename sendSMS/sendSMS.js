const AWS = require('aws-sdk');

const sns = new AWS.SNS({
	region: 'ap-southeast-2',
});

const sentences = [
	'Look at those big gray eyes and that beautiful red hair!',
	`It's such a beautiful day.`,
	`You are the most beautiful woman I have ever seen.`,
	`What a beautiful place.`,
	`To me, a beautiful horse is one that looks friendly.`,
	`You'll have to show me these beautiful flowers.`,
	`"Yes, it is a beautiful place," was the answer.`,
];

const rndSentence = sentences[Math.floor(Math.random() * sentences.length)];
const phone = process.env.PHONE || '+61430055087'

const params = {
	Message: rndSentence,
	PhoneNumber: phone,
}

sns.publish(params, (err, data) => {
	if (err) throw err;
	console.log(`Succeed: ${JSON.stringify(data, null, 2)}`);
});