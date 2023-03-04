
let currentMonth = new Date().getMonth() + 1;
currentMonth = currentMonth.toString();
let currentYear = new Date().getFullYear();

// test year
// currentYear = 2028;

if (window.location.pathname === '/') { 
  const monthSelect = document.getElementById('month');
  const yearSelect = document.getElementById('year');
  addYears(yearSelect);
  
  const submitButton = document.getElementById('getSubs');
  const btnSpinner = submitButton.children[0];
  const btnText = submitButton.children[1];

  // Set the current month and year in the select elements
  if (currentMonth < 10) {
    currentMonth = `0${currentMonth}`;
  }
  monthSelect.value = currentMonth;
  yearSelect.value = currentYear;
  
  // Remove on load if it is there
  btnSpinner.classList.add('d-none');

  submitButton.addEventListener('click', (e) => {
    // e.preventDefault();
    btnSpinner.classList.remove('d-none');
    btnText.classList.add('d-none');
    setTimeout(() => {
      btnSpinner.classList.add('d-none');
      btnText.classList.remove('d-none');
    }, 5000);
  });
}

if (window.location.pathname === '/all') {
  const table = document.querySelector('table');
  const exportBtn = document.getElementById('export-btn');
  const container = document.querySelector('.container');
  container.classList.add('container-fluid');
  container.classList.remove('container');
  table.style.opacity = 1
  exportBtn.style.transform = 'translateY(0)';
}


function addYears(yearSelect) {
  const baseYear = 2023;
  let nowYear = new Date().getFullYear();
  // test year
  // nowYear = 2030;
  let difference = nowYear - baseYear;

  for (let i = 0; i <= difference; i++) {
    let year = baseYear + i;
    let option = document.createElement('option');
    option.value = year;
    option.innerHTML = year;
    yearSelect.appendChild(option);
  }
}





