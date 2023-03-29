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
    <span id="workingstatus" class="limited"></span> 
    </li>
  </ul>
</div>

<style>
  #workingstatus {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 10px;
    position: relative;
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

{% assign current_time = site.time | date: "%H:%M:%S" %}
{% if current_time >= "09:00:00" and current_time < "12:00:00" or current_time >= "15:00:00" and current_time < "20:00:00" %}
  <script>document.getElementById("workingstatus").className = "available";</script>
{% elsif current_time >= "23:00:00" or current_time >= "00:00:00" and current_time < "09:00:00" %}
  <script>document.getElementById("workingstatus").className = "unavailable";</script>
{% else %}
  <script>document.getElementById("workingstatus").className = "limited";</script>
{% endif %}
