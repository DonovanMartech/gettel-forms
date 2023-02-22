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
let formUrl

// jotform
//   .getReports()
//   .then(function (r) {
//     // reports = JSON.stringify(r, null, 4)
//     let grids = r.filter((report) => {
//       return report.list_type === "grid"
//     })
//     grid = grids.map((grid) => {
//       reportUrl = grid.url
//       reportTitle = grid.title
//       formUrl = grid.form_url
//       console.log(grid)
//       return JSON.stringify(grid, null, 4)
//     })
//   })
//   .fail(function (e) {
//     /* handle error */
//     console.log(e)
//   })

jotform
  .getFormSubmissions(process.env.FORMID, {
    filter: {
      "created_at:gt": "2023-01-25 00:00:00",
      "created_at:lt": "2023-01-26 00:00:00",
    },
  })
  .then(function (r) {
    reports = JSON.stringify(r, null, 4)
    // console.log(reports)
  })

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
    reports: reports,
    grid: grid,
    reportUrl: reportUrl,
    reportTitle: reportTitle,
    formUrl: formUrl,
  })
})

module.exports = router
