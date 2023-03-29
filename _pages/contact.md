---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: true
---

{% include base_path %}

### Email: 

<div>
  <ul>
    <li> 
      <a href="mailto:hao.zhao@durham.ac.uk">hao.zhao@durham.ac.uk</a>
      <span id="workingstatus"></span> 
      <span id="uktime"></span>
    </li>
  </ul>
</div>

<style>
  #workingstatus {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 4px;
    text-align: center;
  }

  .available {
    background-color: #2ecc71;
  }

  .unavailable {
    background-color: #bdc3c7;
  }

  .limited {
    background-color: orange;
  }

  #workingstatus::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
    margin: 3px;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<script>
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

    setTimeout(updateWorkingStatus, 1000);
  }
  
  updateWorkingStatus();
</script>


### Address:

Durham University Business School, <br>
Mill Hill Lane, <br>
Durham, <br>
DH1 3LB
