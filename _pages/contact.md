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

### Address:

Durham University Business School, <br>
Mill Hill Lane, <br>
Durham, <br>
DH1 3LB
