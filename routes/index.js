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

//Grabbing all active forms and adding them to forms array, seperated by id and title
jotform
	.getForms()
	.then(function (r) {
		let formObj = {};
		activeForms = r.filter((form) => {
			return form.status === 'ENABLED';
		});
		activeForms.map((form) => {
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
		grid: grid,
		reportUrl: reportUrl,
		reportTitle: reportTitle,
		formUrl: formUrl,
		forms: JSON.stringify(forms),
	});
});

router.get('/all', (req, res, next) => {
	let year = req.query.year;
	let month = req.query.month;
	res.locals.lastDayOfPreviousMonth =
		new Date(year, month - 1, -1).toISOString().split('T')[0] + ' 00:00:00';
	res.locals.firstDayOfNextMonth =
		new Date(year, month, 1).toISOString().split('T')[0] + ' 00:00:00';

  // console.log(jSubmissions(lastDayOfPreviousMonth, firstDayOfNextMonth));
  jSubmissions(res.locals.lastDayOfPreviousMonth, res.locals.firstDayOfNextMonth)
	
  next();
},(req, res) => {
  // console.log('line 81: ' + res.locals.lastDayOfPreviousMonth);
  
  res.render('all', {
		forms: JSON.stringify(forms),
		f: res.locals.lastDayOfPreviousMonth,
		l: res.locals.firstDayOfNextMonth,
	});
}
);

function jSubmissions(lastMonth, nextMonth) {
  let subs;
  jotform
			.getFormSubmissions(process.env.FORMID, {
				filter: {
					'created_at:gt': lastMonth,
					'created_at:lt': nextMonth,
				},
			})
			.then(function (r) {
  				subs = JSON.stringify(r);
          console.log('line 93: ' + subs);
			});
}

module.exports = router;
