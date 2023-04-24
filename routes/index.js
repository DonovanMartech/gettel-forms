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

let monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/* GET home page. */
router.get('/', async function (req, res, next) {
	ogForms = await getAllForms();
	let formInfo = await formInfoFormat(ogForms);
	res.render('index', {
		title: 'Gettel Forms',
		ogForms: ogForms,
		formInfo: formInfo,
		monthNames: monthNames,
	});
});

// Displaying all submissions from selected month and year
router.get('/all', async (req, res, next) => {
	ogForms = await getAllForms();
	let year = req.query.year;
	let month = req.query.month;
	let lastDayOfPreviousMonth = new Date(year, month - 1, -1);
	let firstDayOfNextMonth = new Date(year, month, 1);
	let submissions = await jotGetSubs(
		lastDayOfPreviousMonth,
		firstDayOfNextMonth
	);
	// console.log(await submissions + ': line 52');
	let formInfo = await getAnswers(submissions);

	res.render('all', {
		lastDayOfPreviousMonth: lastDayOfPreviousMonth,
		firstDayOfNextMonth: firstDayOfNextMonth,
		subs: submissions,
		formInfo: formInfo,
		selectedDate: {
			year: year,
			month: getMonthName(month),
		},
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
			// Goes through each submission and adds the form title to the first item
			// by comparing the form_id to the id of the form in the ogForms array
			response.map((item) => {
				let formID = item.form_id;
				let answers = item.answers;
				
				for (let key in answers) {
					if (answers[key].order === '2') {
						// console.log('found it!!!!!!');
						// console.log(answers[key]);
						answers.location = answers[key].answer
						answers.location = {
							'location': answers[key].answer,
							'formID': formID
						}
					}
				}

				// let firstItem = answers['46'] || answers['183'];
				let firstItem = answers.location;
				firstItem.formID = formID;
				ogForms.forEach((form) => {
					if (form.id === formID) {
						firstItem.answer = form.title;
					}
				});
			});
			return response;
		})
		.catch((e) => {
			console.log(e);
		});
	return submission;
}

async function getAnswers(data) {
	// map() the answers property of each object in the array
	// console.log(data + ': line 127');
	const gotAnswers = data.map((item) => {
		return item.answers;
	});

	// map() the object's values into an array
	const answersToArray = gotAnswers.map((item, index) => {
		let currentArray = Object.values(gotAnswers[index]);
		let arrayItem = Object.values(item);
		// console.log(currentArray[currentArray.length - 1]);
		// console.log(arrayItem);
		// arrayItem[0].what = 'Heading';
		arrayItem[arrayItem.length - 1].what = 'Heading';
		let poorFilter = arrayItem.filter((item) => {
			if (item.answer === 'Poor' || item.what === 'Heading') {
				getAdditionalData(item, currentArray);

				return item;
			}
		});
		console.log(poorFilter);

		return poorFilter;
	});
	const filtered = await removeEmptyArray(answersToArray);
	// return the array of arrays
	return filtered;
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
			}
			if (item.order === descOrder) {
				data.descAnswer = item.answer;
			}
		});
	}
	// I was going to return the data but im modifying it directly so there is no need
	// return order;
}

function getMonthName(monthNumber) {
	const date = new Date();
	date.setMonth(monthNumber - 1);

	return date.toLocaleString('en-US', { month: 'long' });
}

async function removeEmptyArray(arr) {
	let newArr = arr.filter((item) => {
		return item.length > 1;
	});
	return newArr;
}

module.exports = router;
