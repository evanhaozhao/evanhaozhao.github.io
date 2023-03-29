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
***Affiliations***
- [Department of Finance](https://www.durham.ac.uk/business/about/departments/finance/), Durham University Business School
- [The Northern Ireland and North East Doctoral Training Partnership](https://www.ninedtp.ac.uk/) (NINE DTP), Economic and Social Research Council (ESRC), UK Research and Innovation

***
***Supervisors***
- [Xian Gu](https://www.durham.ac.uk/business/our-people/xian-gu/), Associate Professor in Finance at Durham University Business School
- [Felix Irresberger](https://www.durham.ac.uk/business/our-people/felix-irresberger/), Associate Professor in Finance at Durham University Business School

***
***Contact***
<html>
  <head>
    <script>
        function updateStatus() {
        var now = new Date();
        var utcHours = now.getUTCHours();
        var utcMinutes = now.getUTCMinutes();
        var ukHours = (utcHours + 1) % 24; // Add 1 hour during daylight saving time
        var ukMinutes = utcMinutes;
        if (ukHours >= 9 && ukHours < 21) {
            document.getElementById('workingstatus').className = 'available';
        } else {
            document.getElementById('workingstatus').className = 'unavailable';
        }
        setTimeout(updateStatus, 1000);
        }
    </script>
  </head>
  <body onload="updateStatus()">
    <div>
      <ul>
        <li> Email: <a href="mailto:hao.zhao@durham.ac.uk">hao.zhao@durham.ac.uk</a>
        <span id="workingstatus"></span> 
        </li>
      </ul>
    </div>
  </body>
</html>