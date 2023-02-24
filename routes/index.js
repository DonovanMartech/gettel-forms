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
	console.log(await getAllForms());
	res.render('index', {
		title: 'Express',
		ogForms: ogForms,
	});
});

// Displaying all submissions from selected month and year
router.get('/all', async (req, res, next) => {
	let year = req.query.year;
	let month = req.query.month;
	res.locals.lastDayOfPreviousMonth =
		new Date(year, month - 1, -1).toISOString().split('T')[0] + ' 00:00:00';
	res.locals.firstDayOfNextMonth =
		new Date(year, month, 1).toISOString().split('T')[0] + ' 00:00:00';
	let submissions = await jotGetSubs(res);
	// console.log(submissions);
	res.render('all', {
		forms: JSON.stringify(forms),
		f: res.locals.lastDayOfPreviousMonth,
		l: res.locals.firstDayOfNextMonth,
		subs: submissions,
	});
});

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
async function jotGetSubs(res) {
	let filter = {
		filter: {
			'created_at:gt': res.locals.lastDayOfPreviousMonth,
			'created_at:lt': res.locals.firstDayOfNextMonth,
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
