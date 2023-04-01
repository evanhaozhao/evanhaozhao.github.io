---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: false
---

***Email***

<p><span id="email">hao.zhao@durham.ac.uk</span><button id="copyButton" data-clipboard-target="#email">Copy</button></p>
<div id="tooltip"></div>

<style>
  #copyButton {
    display: inline-block;
    margin-left: 10px;
    border: 1px solid #ccc;
    background-color: #f7f7f7;
    color: #555;
    font-size: 14px;
    line-height: 1;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  #tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    opacity: 1;
    transition: opacity 0.2s ease-out;
    display: none;
  }
  #tooltip.fade {
    opacity: 0;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>

<script>
  var clipboard = new ClipboardJS('#copyButton');
  clipboard.on('success', function(e) {
    e.clearSelection();
    var tooltip = document.querySelector('#tooltip');
    tooltip.textContent = 'Copied!';
    tooltip.style.left = e.trigger.offsetLeft + 'px';
    tooltip.style.top = e.trigger.offsetTop - 30 + 'px';
    tooltip.style.display = 'block';
    tooltip.classList.remove('fade');
    setTimeout(function() {
      tooltip.classList.add('fade');
      setTimeout(function() {
        tooltip.style.display = 'none';
      }, 200);
    }, 1000);
  });
  clipboard.on('error', function(e) {
    alert('Failed to copy email address!');
  });
</script>

<div>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone-with-data-10-year-range.min.js"></script>


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
    var now = moment().tz('Europe/London');
    var ukHours = now.hour();
    var ukMinutes = now.minute();
    var ukSeconds = now.second();
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
    
    var ukTimeString = now.format('HH:mm:ss');
    ukTimeElement.textContent =  '  ' + ukTimeString + ' (UK)';

    updateClock();
    setTimeout(updateWorkingStatus, 1000);
  }
  updateWorkingStatus();
</script>

***
***Schedule***

University term: <span id="current-term"></span>
<div class="container">
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
  </div>
</div>

***
***Address***

Durham University Business School<br>
Mill Hill Lane<br>
Durham<br>
DH1 3LB

<div style="position: relative; padding-bottom: 40%; height: 0;">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2301.900588710033!2d-1.5882046843724191!3d54.764134575270376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487e8742ad6f22df%3A0x8bafc519658bc8ba!2sBusiness%20School%20%E2%80%A2%20Durham%20University!5e0!3m2!1sen!2suk!4v1680297322922!5m2!1sen!2suk" style="position: absolute; top: 0; left: 0; width: 72%; height: 100%; border: 0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>


<style>
  .container {
    background-color: #F1F2F2;
    display: inline-block;
    line-height: 20px;
    width: 30%;
  }
  .progress {
    height: 20px;
  }
  .progress-bar {
    background-color: #E1E2E3;
    color: #E1E2E3;
    font-size: 0;
  }
  .progress-bar:hover {
    background-color: #BBD6B8;
    color: #FFF;
    font-size: 0;
    transition: color 0.2s ease-in-out;
    transition: background-color 0.2s ease-in-out;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone-with-data-10-year-range.min.js"></script>

<script>
  var now = moment().tz('Europe/London');
  var daysInYear = moment.utc().endOf('year').dayOfYear();
  var daysPassed = moment.utc().dayOfYear();
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
</script>

<script>
  const terms = [
    {
    name: "Induction Week",
    start: moment("2022-09-26"),
    end: moment("2022-10-02")
    },
    {
    name: "Michaelmas Term",
    start: moment("2022-10-03"),
    end: moment("2022-12-09")
    },
    {
    name: "Christmas vacation",
    start: moment("2022-12-10"),
    end: moment("2023-01-08")
    },
    {
    name: "Epiphany Term",
    start: moment("2023-01-09"),
    end: moment("2023-03-17")
    },
    {
    name: "Easter vacation",
    start: moment("2023-03-18"),
    end: moment("2023-04-23")
    },
    {
    name: "Easter Term",
    start: moment("2023-04-24"),
    end: moment("2023-06-23")
    },
    {
    name: "Summer vacation",
    start: moment("2023-06-24"),
    end: moment("2023-09-24")
    },
    {
    name: "Summer vacation",
    start: moment("2023-06-24"),
    end: moment("2023-09-24")
    },
    {
    name: "Induction Week",
    start: moment("2023-09-25"),
    end: moment("2023-10-01")
    },
    {
    name: "Michaelmas Term",
    start: moment("2023-10-02"),
    end: moment("2023-12-08")
    },
    {
    name: "Christmas vacation",
    start: moment("2023-12-09"),
    end: moment("2024-01-07")
    },
    {
    name: "Epiphany Term",
    start: moment("2024-01-08"),
    end: moment("2024-03-15")
    },
    {
    name: "Easter vacation",
    start: moment("2024-03-16"),
    end: moment("2024-04-21")
    },
    {
    name: "Easter Term",
    start: moment("2024-04-22"),
    end: moment("2024-06-21")
    },
    {
    name: "Summer vacation",
    start: moment("2024-06-22"),
    end: moment("2024-09-29")
    },
    {
    name: "Summer vacation",
    start: moment("2024-06-22"),
    end: moment("2024-09-29")
    },
    {
    name: "Induction Week",
    start: moment("2024-09-30"),
    end: moment("2024-10-06")
    },
    {
    name: "Michaelmas Term",
    start: moment("2024-10-07"),
    end: moment("2024-12-13")
    },
    {
    name: "Christmas vacation",
    start: moment("2024-12-14"),
    end: moment("2025-01-12")
    },
    {
    name: "Epiphany Term",
    start: moment("2025-01-13"),
    end: moment("2025-03-21")
    }
  ];

  const currentTerm = terms.find(term => {
    const now = moment().tz('Europe/London');
    return now.isBetween(term.start, term.end);
  });

  document.getElementById("current-term").textContent = currentTerm.name + " (" + currentTerm.start.year() + ")";
</script>