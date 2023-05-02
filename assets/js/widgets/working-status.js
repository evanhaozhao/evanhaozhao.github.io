

function updateClock() {
    var now = moment();
    var second = now.seconds();
    var secondAngle = second * 6;
    var secondHand = document.getElementById('second-hand');
    secondHand.setAttribute('d', 'M10 10 L10 1');
    secondHand.setAttribute('transform', 'rotate(' + secondAngle + ' 10 10)');
    setTimeout(updateClock, 1000);
}

function updateWorkingStatus() {
    var now = moment().tz('Europe/London');
    var ukHours = now.hour();
    var ukMinutes = now.minute();
    var workingStatusElement = document.getElementById('workingstatus');

    if ((ukHours >= 9 && ukHours < 12) || (ukHours >= 15 && ukHours < 20)) {
        workingStatusElement.className = 'available';
        workingStatusElement.title = 'Online';
    } else if (ukHours >= 23 || (ukHours >= 0 && ukHours < 9)) {
        workingStatusElement.className = 'unavailable';
        workingStatusElement.title = 'Offline';
    } else {
        workingStatusElement.className = 'limited';
        workingStatusElement.title = 'Away';
    }
    updateClock();
    setTimeout(updateWorkingStatus, 1000);
}
updateWorkingStatus();
