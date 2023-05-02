
const switchButton = document.querySelector('.switch input');
const cvDetail = document.querySelector('.cv-detail');
const cvSimplified = document.querySelector('.cv-simplified');
const cvMode = document.querySelector('#cv-mode');

cvDetail.style.display = 'none';
cvSimplified.style.display = 'block';
cvMode.innerHTML = 'simplified';

switchButton.addEventListener('click', function() {
  if (this.checked) {
    cvDetail.style.display = 'block';
    cvSimplified.style.display = 'none';
    cvMode.innerHTML = 'detail';
  } else {
    cvDetail.style.display = 'none';
    cvSimplified.style.display = 'block';
    cvMode.innerHTML = 'simplified';
  }
});
