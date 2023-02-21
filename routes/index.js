var express = require("express")
var router = express.Router()
const jotform = require("jotform")
require("dotenv").config()
const apiKey = process.env.APIKEY

jotform.options({
  debug: true,
  apiKey: apiKey,
})

let reports
let grid
let reportUrl
let reportTitle

jotform
  .getReports()
  .then(function (r) {
    reports = JSON.stringify(r, null, 4)
    let grids = r.filter((report) => {
      return report.list_type === "grid"
    })
    grid = grids.map((grid) => {
      reportUrl = grid.url
	  reportTitle = grid.title
      console.log(grid)
      return JSON.stringify(grid, null, 4)
    })
  })
  .fail(function (e) {
    /* handle error */
    console.log(e)
  })

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
    reports: reports,
    grid: grid,
    reportUrl: reportUrl,
    reportTitle: reportTitle,
  })
})

module.exports = router
