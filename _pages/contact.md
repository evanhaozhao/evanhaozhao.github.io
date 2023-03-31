---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: true
---

{% include base_path %}

### Email: 

<div>
  Email: <a href="mailto:hao.zhao@durham.ac.uk">hao.zhao@durham.ac.uk</a>
    <span id="workingstatus">
      <svg viewBox="0 0 20 20" width="8" height="8">
        <path id="second-hand" d="M10 6 L10 6" stroke="white" stroke-width="5" stroke-linecap="round" />
      </svg>
    </span> 
    <span id="uktime"></span>
</div>

<style>
 #workingstatus {
   display: inline-block;
   width: 12px;
   height: 12px;
   border-radius: 50%;
   margin-left: 4px;
   text-align: center;
   position: relative;
 }

#workingstatus svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  z-index: 1;
}

 .available {
   background-color: #2ecc71;
 }


 .available:hover {
   background-color: #25A35A;
 }


 .limited {
   background-color: #FFA500;
 }


 .limited:hover {
   background-color: #CC8400;
 }


 .unavailable {
   background-color: #bdc3c7;
 }


 .unavailable:hover {
   background-color: #979C9F;
 }


 #workingstatus::before {
   content: "";
   display: block;
   width: 6px;
   height: 6px;
   background-color: white;
   border-radius: 50%;
   margin: 3px;
   position: absolute;
 }

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<script>
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
    var now = moment();
    var ukHours = now.utcOffset(0).utc().add(1, 'hours').hour();
    var ukMinutes = now.utcOffset(0).utc().minute();
    var ukSeconds = now.utcOffset(0).utc().second();
    var workingStatusElement = document.getElementById('workingstatus');
    var ukTimeElement = document.getElementById('uktime');

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
    
    var ukTimeString = moment().utcOffset(0).add(1, 'hours').format('h:mm:ss A'); 
    ukTimeElement.textContent =  ukTimeString + ' (UK time)';

    updateClock();
    setTimeout(updateWorkingStatus, 1000);
  }
  
  updateWorkingStatus();
</script>


### Address:

Durham University Business School, <br>
Mill Hill Lane, <br>
Durham, <br>
DH1 3LB
