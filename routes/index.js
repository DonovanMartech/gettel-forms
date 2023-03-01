var express = require('express');
var router = express.Router();
const jotform = require('jotform');
require('dotenv').config();
const apiKey = process.env.APIKEY;

jotform.options({
	debug: true,
	apiKey: apiKey,
});

let forms = [];
let ogForms = [];

/* GET home page. */
router.get('/', async function (req, res, next) {
	ogForms = await getAllForms();
	// console.log(ogForms);
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

// old might remove
// async function formatSubmissions(subs, formInfo) {
// 	// creat array to hold formatted submissions
// 	const formattedSubs = [];
// 	const justTheAnswers = [];
// 	let test;
// 	// loop through submissions with given form id from formInfo

// 	let filteredSubs = subs.filter((sub) => {
// 		return sub.answer === 'Poor';
// 	});

// 	formInfo.forEach((form) => {
// 		test = subs.map((sub) => {
// 			if (form.id === sub.form_id) {
// 				let edit = sub.answers;
// 				edit.info = form;
// 				edit.info.answer = 'Heading'

// 				return edit;
// 			}
// 		});
// 	});

// 	let removeNoAnswer = test.filter((sub) => {
// 		let asArray = Object.entries(sub);
// 		console.log('sub ' + JSON.stringify(asArray, null, 2));
// 		return asArray.answer === 'Poor';
// 	});

// 	// console.log('TEST' + JSON.stringify(filteredSubs));
// 	// return test;
// 	// return removeNoAnswer;

// }

async function getAnswers(data, formInfo) {
	// map() the answers property of each object in the array
	const gotAnswers = data.map((item) => {
		return item.answers;
	});

	// map() the object's values into an array
	const answersToArray = gotAnswers.map((item) => {
		let arrayItem = Object.values(item);
		arrayItem[0].what = 'Heading';
		let poorFilter = arrayItem.filter((item, index) => {
			if (
				item.answer === 'Poor' ||
				item.what === 'Heading'
			) {
				//TODO store order number of poor answer
				// then get the next two according to order number
				// add answers as properties to the original order number
				return item;
			}

			//TODO once above comment is done, remove this if statement
			if (item.answer !== undefined && item.answer.toString().includes('https')) {
				return item;
			}
		});
		return poorFilter;
	});

	// return the array of arrays
	return answersToArray;
}

async function getAdditionalData(data) {
	let poor = data.answer === 'Poor';
	let order = data.order;
	let gatheredInfo;
	if (poor) {
		const otherInfo = data.map((item) => {
			

		});
	}
	
}

module.exports = router;
