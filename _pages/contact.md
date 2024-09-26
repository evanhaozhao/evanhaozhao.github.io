---
layout: single
title: "Contact"
permalink: /contact/
author_profile: false
---

***Email***

<p><span id="email">hao.zhao@durham.ac.uk</span><button id="copyButton" class="copyButton" data-clipboard-target="#email" title="Copy Email">Copy</button></p>
<div class="tooltip"></div>

<div>
  <span id="workingstatus">
    <svg viewBox="0 0 20 20" width="8" height="8">
      <path id="second-hand" d="M10 6 L10 6" stroke="white" stroke-width="5" stroke-linecap="round" />
    </svg>
  </span> 
  <span id="uktime"></span>
</div>

***
***Schedule***

<p>Current term: <span id="current-term"></span></p>
<p>Next term: <span id="next-term"></span></p>

<p>Durham Finance Department activities: 
  <a href="https://www.durham.ac.uk/business/about/departments/finance/seminars/" target="_blank">2024-25 Seminars</a>
</p>

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




{% comment %} 
  Style: (a) general, (b) gray button
{% endcomment %} 

<link rel="stylesheet" type="text/css" href="/assets/css/widgets_style/widgets.css">

<link rel="stylesheet" type="text/css" href="/assets/css/widgets_style/copy-button-gray.css">

{% comment %} 
  (1) A copy button 
{% endcomment %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>

<script src="/assets/js/widgets/copy-button-gray.js"></script>

{% comment %} 
  (2) Working status & Time 
{% endcomment %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone-with-data-10-year-range.min.js"></script>

<script src="/assets/js/widgets/working-status-time.js"></script>

{% comment %} 
  (3) Progress bar
{% endcomment %}

<script src="/assets/js/widgets/progress-bar.js"></script>

{% comment %} 
  (4) Academic term
{% endcomment %}

<script src="/assets/js/widgets/term-display.js"></script>

{% comment %}
Privacy Disclosure: To better understand the performance of my website and improve the quality of its content, I use two common analytics tools: (1) google-analytics and (2) clustrmaps. These tools collect data on the number of visits and the countries from which visitors access my website. While the information collected does not identify individual users, you have the option to block google-analytics and clustrmaps using browser extensions such as Privacy Badger. However, please note that doing so may also block certain functions from Google and online JavaScript libraries.
{% endcomment %}

<iframe id="analyticsmaps" src="https://clustrmaps.com/map_v2.js?d=ljZQTDJfn0E3rOWlQAvvKP6VTpz3da0vNLenGIfmDFY&cl=ffffff&w=a" frameborder="0" scrolling="no" width="1" height="1"></iframe>

<script type="text/javascript">
  window.addEventListener("load", function(){
    var analyticsmaps = document.getElementById('analyticsmaps');
    analyticsmaps.style.display = 'none';
  });
</script>