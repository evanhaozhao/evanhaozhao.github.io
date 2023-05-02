
var copyButtons = document.querySelectorAll('.copyButton');
var tooltips = document.querySelectorAll('.tooltip');

for (var i = 0; i < copyButtons.length; i++) {
    var clipboard = new ClipboardJS(copyButtons[i], {
      text: function(trigger) {
        return document.querySelector(trigger.getAttribute('data-clipboard-target')).value;
      }
    });

    clipboard.on('success', function(e) {
      var tooltip = e.trigger.nextElementSibling;
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
      alert('Failed to copy text!');
    });
}