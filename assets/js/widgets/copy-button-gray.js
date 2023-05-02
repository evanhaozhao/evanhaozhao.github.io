
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