---
permalink: /
title: ""
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

**Welcome to my website!**

I'm Hao Zhao, a first-year PhD candidate in Finance at Durham University.

***
***Interests***
- Corporate finance
- Empirical asset pricing
- Data science

***
***Education***
- PhD, Durham University (*current*)
- MSc, University of Birmingham
- BEc, Northeastern University (CN)

***
***Affiliations***
- [Department of Finance](https://www.durham.ac.uk/business/about/departments/finance/), Durham University Business School
- [ESRC NINE DTP](https://www.ninedtp.ac.uk/), UK Research and Innovation

***
***Supervisors***
- [Dr Xian Gu](https://www.durham.ac.uk/business/our-people/xian-gu/), Associate Professor in Finance
- [Dr Felix Irresberger](https://www.durham.ac.uk/business/our-people/felix-irresberger/), Associate Professor in Finance

***
***Contact***

<div>
  <ul>
    <li> Email: hao.zhao@durham.ac.uk
      <span id="workingstatus">
        <svg viewBox="0 0 20 20" width="8" height="8">
          <path id="second-hand" d="M10 6 L10 6" stroke="white" stroke-width="5" stroke-linecap="round" />
        </svg>
      </span> 
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
</script>

{% comment %}
Privacy Disclaimer: I use two widely-used analytics tools (1) `google-analytics`, and (2) `clustrmaps`, solely for the purpose of collecting the number of visits and countries of IP, understanding the attractiveness of the webpage, and improving the quality of the content. You may block the `google-analytics` and `clustrmaps` using a browser extension such as `Privacy Badger` (please note using these extensions may also block certain functions from google, online JavaScript libraries, etc.).
{% endcomment %}

<iframe id="analyticsmaps" src="//clustrmaps.com/map_v2.js?d=32tzqS2_KJmUqquMfE-USyiHKpsEMk1UupDQyOVE8fA&cl=ffffff&w=a" frameborder="0" scrolling="no" width="1" height="1"></iframe>

<script type="text/javascript">
  window.addEventListener("load", function(){
    var analyticsmaps = document.getElementById('analyticsmaps');
    analyticsmaps.style.display = 'none';
  });
</script>
