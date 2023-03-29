---
permalink: /
title: ""
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% include base_path %}

**Welcome to my website!**

I'm Hao Zhao, a first-year PhD candidate in Finance at Durham University.

***
***Interests***
- Corporate finance
- Empirical asset pricing
- Data science

***
***Affiliations***
- [Department of Finance](https://www.durham.ac.uk/business/about/departments/finance/), Durham University Business School
- [The Northern Ireland and North East Doctoral Training Partnership](https://www.ninedtp.ac.uk/) (NINE DTP), Economic and Social Research Council (ESRC), UK Research and Innovation

***
***Supervisors***
- [Xian Gu](https://www.durham.ac.uk/business/our-people/xian-gu/), Associate Professor in Finance at Durham University Business School
- [Felix Irresberger](https://www.durham.ac.uk/business/our-people/felix-irresberger/), Associate Professor in Finance at Durham University Business School

***
***Contact***

<div>
  <ul>
    <li> Email: <a href="mailto:hao.zhao@durham.ac.uk">hao.zhao@durham.ac.uk</a>
      <span id="workingstatus"></span> 
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
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<script>
  function updateWorkingStatus() {
    var now = moment();
    var ukHours = now.utcOffset(0).utc().add(1, 'hours').hour();
    var ukMinutes = now.utcOffset(0).utc().minute();
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
    
    setTimeout(updateWorkingStatus, 1000);
  }
  
  updateWorkingStatus();
</script>
