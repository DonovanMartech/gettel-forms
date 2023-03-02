var express = require('express');
var router = express.Router();
const jotform = require('jotform');
require('dotenv').config();
const apiKey = process.env.APIKEY;

jotform.options({
	debug: true,
	apiKey: apiKey,
});

let ogForms = [];

/* GET home page. */
router.get('/', async function (req, res, next) {
	ogForms = await getAllForms();
	let formInfo = await formInfoFormat(ogForms);
	res.render('index', {
		title: 'Express',
		ogForms: ogForms,
		formInfo: formInfo,
	});
});

// Displaying all submissions from selected month and year
router.get('/all', async (req, res, next) => {
	let year = req.query.year;
	let month = req.query.month;
	let formInfo = JSON.parse(req.query.formInfo);
	let lastDayOfPreviousMonth = new Date(year, month - 1, -1);
	let firstDayOfNextMonth = new Date(year, month, 1);
	let submissions = await jotGetSubs(
		lastDayOfPreviousMonth,
		firstDayOfNextMonth
	);
	// console.log(formatSubmissions(submissions, formInfo));
	let testFormat = await getAnswers(submissions, formInfo);
	res.render('all', {
		lastDayOfPreviousMonth: lastDayOfPreviousMonth,
		firstDayOfNextMonth: firstDayOfNextMonth,
		subs: submissions,
		formInfo: formInfo,
		test: testFormat,
	});
});

// Gathering just the title and id
async function formInfoFormat(forms) {
	let formInfoFormat = forms.map((form) => {
		return {
			title: form.title,
			id: form.id,
		};
	});
	return formInfoFormat;
}

//Grabbing all active forms
async function getAllForms() {
	let allForms = await jotform
		.getForms()
		.then(function (r) {
			let activeForms = r.filter((form) => {
				return form.status === 'ENABLED';
			});
			return activeForms;
		})
		.fail(function (e) {
			console.log(e);
		});
	return allForms;
}

//Grabbing all submissions from selected month and year
async function jotGetSubs(prevMonth, nextMonth) {
	let filter = {
		filter: {
			'created_at:gt': prevMonth,
			'created_at:lt': nextMonth,
		},
	};
	let submission = await jotform
		.getSubmissions(filter)
		.then((response) => {
			return response;
		})
		.catch((e) => {
			console.log(e);
		});
	return submission;
}

async function getAnswers(data, formInfo) {
	// map() the answers property of each object in the array
	const gotAnswers = data.map((item) => {
		return item.answers;
	});

	// map() the object's values into an array
	const answersToArray = gotAnswers.map((item, index) => {
		let currentArray = Object.values(gotAnswers[index]);
		// console.log(`array index ${index}: ${JSON.stringify(currentArray)}`);
		let arrayItem = Object.values(item);
		arrayItem[0].what = 'Heading';
		let poorFilter = arrayItem.filter((item) => {
			if (
				item.answer === 'Poor' ||
				item.what === 'Heading'
			) {
				
				getAdditionalData(item, currentArray)
				
				return item;
			}
		});
		
		return poorFilter;
	});

	// return the array of arrays
	return answersToArray;
}

async function getAdditionalData(data, curArr) {
	let order = data.order;
	let picOrder = JSON.stringify(+order + 1);
	let descOrder = JSON.stringify(+order + 2);

	if (data.what === 'Heading') {
		header = data;
	}

	if (data.answer === 'Poor') {
		curArr.map((item, i, source) => {
			if (item.order === picOrder) {
				data.picAnswer = item.answer;
			};
			if (item.order === descOrder) {
				data.descAnswer = item.answer;
			}
			if (item.name === 'location') {
				data.location = item.answer;
				source[0].location = item.answer;
			}

		});
		// console.log(data);
	}
	// I was going to return the data but im modifying it directly so there is no need
	// return order;
}

module.exports = router;
