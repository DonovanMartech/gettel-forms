const exportBtn = document.getElementById("export-btn")

const tableToCSV = () => {
  // Variable to store the final csv data
  let csv_data = []

  // Get each row data
  let rows = document.getElementsByTagName("tr")
  for (let i = 0; i < rows.length; i++) {
    // Get each column data
    let cols = rows[i].querySelectorAll("td,th")

    // Stores each csv row data
    let csvrow = []
    for (let j = 0; j < cols.length; j++) {
      // Get the text data of each cell of
      // a row and push it to csvrow
      let links = cols[j]?.children[0]?.children[0]?.href
      if (links) {
        csvrow.push(`"=HYPERLINK(""${links}"",""${cols[j].innerText}"")"`)
        // csvrow.push("=HYPERLINK(""+links+"";""+cols[j].innerText+"")')
      } else {
        csvrow.push(cols[j].innerText)
      }
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","))
  }
  // combine each row data with new line character
  csv_data = csv_data.join("\n")


  /* We will use this function later to download
  the data in a csv file downloadCSVFile(csv_data);
  */
  downloadCSVFile(csv_data)
}

const downloadCSVFile = (csv_data) => {
  // Create CSV file object and feed our
  // csv_data into it
  CSVFile = new Blob([csv_data], { type: "text/csv" })

  // Create to temporary link to initiate
  // download process
  let temp_link = document.createElement("a")

  // Download csv file
  temp_link.download = "GettelForm.csv"
  let url = window.URL.createObjectURL(CSVFile)
  temp_link.href = url

  // This link should not be displayed
  temp_link.style.display = "none"
  document.body.appendChild(temp_link)

  // Automatically click the link to trigger download
  temp_link.click()
  document.body.removeChild(temp_link)
}

exportBtn.addEventListener("click", tableToCSV)
