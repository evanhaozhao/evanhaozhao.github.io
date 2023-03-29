---
layout: archive
title: "Contact"
permalink: /contact/
author_profile: true
---

### Email: 
<html>
    <script type="text/javascript">
        function updateStatus() {
        var now = new Date();
        var utcHours = now.getUTCHours();
        var utcMinutes = now.getUTCMinutes();
        var utcSeconds = now.getUTCSeconds();
        var ukHours = (utcHours + 1) % 24; // Add 1 hour during daylight saving time
        var ukMinutes = utcMinutes;
        var ukSeconds = utcSeconds;
        if ((ukHours >= 9 && ukHours < 12) || (ukHours >= 15 && ukHours < 20)) {document.getElementById('workingstatus').className = 'available';} 
        else if (ukHours >= 23 || ukHours < 9) {document.getElementById('workingstatus').className = 'unavailable';} 
        else {document.getElementById('workingstatus').className = 'other';}
        var ukTimeString = ukHours.toString().padStart(2, '0') + ':' + ukMinutes.toString().padStart(2, '0') + ':' + ukSeconds.toString().padStart(2, '0');
        document.getElementById('uk-time').textContent = ukTimeString;
        setTimeout(updateStatus, 1000);
        }
    </script>
    <body onload="updateStatus()">
        <div>
            <a href="mailto:hao.zhao@durham.ac.uk">hao.zhao@durham.ac.uk</a>
            <span id="workingstatus"></span>
            <span> (UK time) </span>
            <span id="uk-time"></span>
        </div>
    </body>
</html>


### Address:

Durham University Business School, <br>
Mill Hill Lane, <br>
Durham, <br>
DH1 3LB
