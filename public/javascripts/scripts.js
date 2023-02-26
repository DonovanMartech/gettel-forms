console.log(window.location.pathname);

if (window.location.pathname === '/') { 
  const submitButton = document.getElementById('getSubs');
  const btnSpinner = submitButton.children[0];
  const btnText = submitButton.children[1];

  submitButton.addEventListener('click', (e) => {
    // e.preventDefault();
    btnSpinner.classList.remove('d-none');
    btnText.classList.add('d-none');
  });
}






