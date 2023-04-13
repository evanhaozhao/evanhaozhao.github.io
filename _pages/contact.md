---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: false
---

***Email***

<p><span id="email">hao.zhao@durham.ac.uk</span><button id="copyButton" class="copyButton" data-clipboard-target="#email">Copy</button></p>
<div class="tooltip"></div>

<style>
  .copyButton {
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 0.25em;
    padding: 0.125em 0.25em;
    color: #7B8288;
    text-align: center;
    text-decoration: none !important;
    border: 1px solid;
    border-color: #7B8288;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    font-size: 14px;
  }

  .copyButton:hover {
    color: #fff;
    background-color: #bdc3c7 !important;
    border-color: #bdc3c7;
  }

  .tooltip {
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

  .tooltip.fade {
    opacity: 0;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>

<script>
  var clipboard = new ClipboardJS('.copyButton');
  clipboard.on('success', function(e) {
    e.clearSelection();
    var tooltip = document.querySelector('.tooltip');
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


<p>Current term: <span id="current-term"></span></p>
<p>Next term: <span id="next-term"></span></p>
<p><span id="progress-message"></span></p>
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
    width: 45%;
  }
  .progress {
    height: 20px;
  }
  .progress-bar {
    background-color: #E1E2E3;
    color: #E1E2E3;
    font-size: 0;
  }
  .progress-bar:hover,
  .container:hover .progress-bar {
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
    },
    {
    name: "Easter vacation",
    start: moment("2025-03-22"),
    end: moment("2025-04-27")
    },
    {
    name: "Easter Term",
    start: moment("2025-04-28"),
    end: moment("2025-06-27")
    },
    {
    name: "Summer vacation",
    start: moment("2025-06-28"),
    end: moment("2025-09-28")
    },
    {
    name: "Summer vacation",
    start: moment("2025-06-28"),
    end: moment("2025-09-28")
    },
    {
    name: "Induction Week",
    start: moment("2025-09-29"),
    end: moment("2025-10-05")
    },
    {
    name: "Michaelmas Term",
    start: moment("2025-10-06"),
    end: moment("2025-12-12")
    },
    {
    name: "Christmas vacation",
    start: moment("2025-12-13"),
    end: moment("2026-01-11")
    },
    {
    name: "Epiphany Term",
    start: moment("2026-01-12"),
    end: moment("2026-03-20")
    },
    {
    name: "Easter vacation",
    start: moment("2026-03-21"),
    end: moment("2026-04-26")
    },
    {
    name: "Easter Term",
    start: moment("2026-04-27"),
    end: moment("2026-06-26")
    },
    {
    name: "Summer vacation",
    start: moment("2026-06-27"),
    end: moment("2026-09-27")
    },
    {
    name: "Summer vacation",
    start: moment("2026-06-27"),
    end: moment("2026-09-27")
    }
  ];

  const currentTerm = terms.find(term => {
    const now = moment().tz('Europe/London');
    term.remainingDays = term.end.diff(now, 'days') + 1;
    return now.isBetween(term.start, term.end);
  });

  if (!currentTerm) {
    document.getElementById("current-term").textContent = "None";
    document.getElementById("next-term").textContent = "None";
  }
  else{
    document.getElementById("current-term").textContent = currentTerm.name + ", " + currentTerm.remainingDays + " days remain";

    const nextTerm = terms.find(term => term.start.isAfter(currentTerm.end));
    if (!nextTerm) {
      document.getElementById("next-term").textContent = "None";
    }
    else {
      document.getElementById("next-term").textContent = nextTerm.name + " (" + nextTerm.start.year() + ")";
    }
  }
</script>

{% comment %}
Privacy Disclaimer: I use two widely-used analytics tools (1) `google-analytics`, and (2) `clustrmaps`, solely for the purpose of collecting the number of visits and countries of IP, understanding the attractiveness of the webpage, and improving the quality of the content. You may block the `google-analytics` and `clustrmaps` using a browser extension such as `Privacy Badger` (please note using these extensions may also block certain functions from google, online JavaScript libraries, etc.).
{% endcomment %}

<iframe id="analyticsmaps" src="//clustrmaps.com/map_v2.js?d=gruG4U9mRuu8YDAEF9IoqSLL60mJu-BoL7zExdrwQNI&cl=ffffff&w=a" frameborder="0" scrolling="no" width="1" height="1"></iframe>

<script type="text/javascript">
  window.addEventListener("load", function(){
    var analyticsmaps = document.getElementById('analyticsmaps');
    analyticsmaps.style.display = 'none';
  });
</script>