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
	let lastDayOfPreviousMonth =
		new Date(year, month - 1, -1);
	let firstDayOfNextMonth =
		new Date(year, month, 1);
	let submissions = await jotGetSubs(lastDayOfPreviousMonth, firstDayOfNextMonth);
	// console.log('FORMINFO: ' + formInfo);
	res.render('all', {
		lastDayOfPreviousMonth: lastDayOfPreviousMonth,
		firstDayOfNextMonth: firstDayOfNextMonth,
		subs: submissions,
		formInfo: formInfo,
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

module.exports = router;

