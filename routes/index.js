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
		console.log('activeForms: ', activeForms);
		console.log('forms: ', forms);
		return formObj;
	})
	.then((formObj) => {
		jotform.getFormSubmissions(forms[1].id, {
			filter: {
				'created_at:gt': '2023-01-26 00:00:00',
				'created_at:lt': '2023-01-27 00:00:00',
			},
		})
    .then(function (r) {
      reports = JSON.stringify(r, null, 4)
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
		forms: JSON.stringify(forms, null, 4),
	});
	console.log(forms[0].id);
});

module.exports = router;
