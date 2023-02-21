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
jotform
	.getReports()
	.then(function (r) {
		reports = JSON.stringify(r, null, 4);
	})
	.fail(function (e) {
		/* handle error */
		console.log(e);
	});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express', reports: reports });
});

module.exports = router;
