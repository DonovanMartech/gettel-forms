console.log(window.location.pathname);

if (window.location.pathname === '/') { 
  const submitButton = document.getElementById('getSubs');
  const btnSpinner = submitButton.children[0];
  const btnText = submitButton.children[1];
  
  btnSpinner.classList.add('d-none');

  submitButton.addEventListener('click', (e) => {
    // e.preventDefault();
    btnSpinner.classList.remove('d-none');
    btnText.classList.add('d-none');
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
  console.log(container.classList);
}





