var express = require('express');
var router = express.Router();
const jotform = require('jotform');
require('dotenv').config();
const apiKey = process.env.APIKEY;

jotform.options({
	debug: true,
	apiKey: apiKey,
});

let reports;
let grid;
let reportUrl;
let reportTitle;
let formUrl;
let forms = [];
let ogForms = [];

//Grabbing all active forms and adding them to forms array, seperated by id and title
jotform
	.getForms()
	.then(function (r) {
		let formObj = {};
		activeForms = r.filter((form) => {
			return form.status === 'ENABLED';
		});
		activeForms.map((form) => {
			ogForms.push(form); //original forms
			formObj = { id: form.id, title: form.title };
			forms.push(formObj);
		});
		// console.log('activeForms: ', activeForms);
		// console.log('forms: ', forms);
		return formObj;
	})
	.then((formObj) => {
		jotform
			.getFormSubmissions(forms[1].id, {
				filter: {
					'created_at:gt': '2023-01-26 00:00:00',
					'created_at:lt': '2023-01-27 00:00:00',
				},
			})
			.then(function (r) {
				reports = JSON.stringify(r, null, 4);
			});
	})
	.fail(function (e) {
		console.log(e);
	});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express',
		reports: reports,
		ogForms: ogForms,
		reportUrl: reportUrl,
		reportTitle: reportTitle,
		formUrl: formUrl,
		forms: JSON.stringify(forms, null, 4),
	});
});




// Get all submissions from selected month
router.get(
	'/all',
	async (req, res, next) => {
		let year = req.query.year;
		let month = req.query.month;
		res.locals.lastDayOfPreviousMonth =
			new Date(year, month - 1, -1).toISOString().split('T')[0] + ' 00:00:00';
		res.locals.firstDayOfNextMonth =
			new Date(year, month, 1).toISOString().split('T')[0] + ' 00:00:00';
		let submissions = await getSubs(forms, res);
		// console.log(submissions);
		res.render('all', {
			forms: JSON.stringify(forms),
			f: res.locals.lastDayOfPreviousMonth,
			l: res.locals.firstDayOfNextMonth,
			subs: submissions,
		});
	}
);

async function jotGetSubs(id, filter) {
	let submission = await jotform
		.getFormSubmissions(id, filter)
		.then((response) => {
			return response;
		})
		.catch((e) => {
			console.log(e);
		});
	return submission;
}

async function getSubs(forms, res) {
	let filter = {
		filter: {
			'created_at:gt': res.locals.lastDayOfPreviousMonth,
			'created_at:lt': res.locals.firstDayOfNextMonth,
		},
	};
	// let subs = await jotGetSubs("223544173984160", filter);
	let subs = await forms.map(async (form) => {
		let sub = await jotGetSubs(form.id, filter);

		return sub;
	});

	let subsResult = await Promise.all(subs);

	return subsResult;
}

module.exports = router;
