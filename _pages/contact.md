---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: true
---

### Email: 

<div>
  <span id="workingstatus"></span>
  <span>Availability Status (UK time): <span id="uktime"></span></span>
</div>

<script>
  function updateWorkingStatus() {
    var now = new Date();
    var utcHours = now.getUTCHours();
    var utcMinutes = now.getUTCMinutes();
    var ukHours = (utcHours + 1) % 24; // Add 1 hour during daylight saving time
    var ukMinutes = utcMinutes;
    var workingStatusElement = document.getElementById('workingstatus');
    var ukTimeElement = document.getElementById('uktime');
    
    if ((ukHours >= 9 && ukHours < 12) || (ukHours >= 15 && ukHours < 20)) {
      workingStatusElement.className = 'available';
    } else if (ukHours >= 23 || (ukHours >= 0 && ukHours < 9)) {
      workingStatusElement.className = 'unavailable';
    } else {
      workingStatusElement.className = 'limited';
    }
    
    ukTimeElement.textContent = ukHours.toString().padStart(2, '0') + ':' + ukMinutes.toString().padStart(2, '0');
    
    setTimeout(updateWorkingStatus, 1000);
  }
  
  updateWorkingStatus();
</script>



### Address:

Durham University Business School, <br>
Mill Hill Lane, <br>
Durham, <br>
DH1 3LB
