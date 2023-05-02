
var now = moment().tz('Europe/London');
var daysInYear = moment.utc(now).endOf('year').dayOfYear();
var daysPassed = moment.utc(now).dayOfYear();
var progressPercentage = (daysPassed / daysInYear) * 100;
var progressBar = document.querySelector('.progress-bar');
progressBar.style.width = progressPercentage + '%';
progressBar.innerText = '%';
progressBar.addEventListener('mouseover', function() {
    var dateFormat = 'D MMMM YYYY';
    var yearMonth = now.format(dateFormat);
    var currentYear = now.year();
    var tooltipText = yearMonth + ', ' + daysPassed + ' days in ' + currentYear + ' (' + progressPercentage.toFixed(2) + '%)';
    progressBar.setAttribute('title', tooltipText);
});
var currentYear = now.year();
document.getElementById("progress-message").textContent = currentYear + " is " + progressPercentage.toFixed(2) + "% complete";