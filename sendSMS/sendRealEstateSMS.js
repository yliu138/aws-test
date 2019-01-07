const AWS = require('aws-sdk');
const rp = require('request-promise');
const $ = require('cheerio');

const sns = new AWS.SNS({
	region: 'ap-southeast-2',
});

const phone = process.env.PHONE || '+61430055087';
const suburb = process.env.SUBURB || 'scoresby';
// to replace the white space with encoded url
const suburbEncoded = suburb.replace(/\s+/ig, '%20');
const postcode = process.env.POSTCODE || '3179';
const state = process.env.STATE || 'VIC';
const url = `https://www.realestate.com.au/neighbourhoods/${suburbEncoded}-${postcode}-${state}`;

rp(url)
	.then((html) => {
		const housePrice = $('.houses .buy-subsection .price.h1', html).text();
		const houseRent = $('.houses .rent-subsection .price.h1', html).text();
		const unitPrice = $('.units .buy-subsection .price.h1', html).text();
		const unitRent = $('.units .rent-subsection .price.h1', html).text();
		const msg = `Warm message:
${suburb}, ${state} market profile update:
House medium price: ${housePrice}; House medium rent: ${houseRent}
Unit medium price: ${unitPrice}; Unit medium rent: ${unitRent}`;

		const params = {
			Message: msg,
			PhoneNumber: phone,
		};

		sns.publish(params, (err, data) => {
			if (err) throw err;
			console.log(`Succeed: ${JSON.stringify(data, null, 2)}`);
		});

	})
	.catch((err) => {
		console.log(`Failed to get the content from ${url}: ${err}`);
	});