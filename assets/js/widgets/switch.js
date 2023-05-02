
const switchButton = document.querySelector('.switch input');
const cvDetail = document.querySelector('.cv-detail');
const cvSimplified = document.querySelector('.cv-simplified');

cvDetail.style.display = 'none';
cvSimplified.style.display = 'block';

switchButton.addEventListener('click', function() {
  if (this.checked) {
    cvDetail.style.display = 'block';
    cvSimplified.style.display = 'none';
  } else {
    cvDetail.style.display = 'none';
    cvSimplified.style.display = 'block';
  }
});
