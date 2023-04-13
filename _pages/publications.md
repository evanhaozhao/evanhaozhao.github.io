---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
<!-- 
{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %} -->

<!-- fa-link
fa-file-pdf
fa-code
fa-github -->

## [Political Network and Muted Insider Trading](http://dx.doi.org/10.2139/ssrn.4230854)
<a href="https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID4230854_code1125739.pdf?abstractid=4230854&mirid=1&type=2"><i class="fas fa-fw fa-file-pdf zoom" aria-hidden="true"></i></a>
Joint with Wei Chen (Citigroup), Xian Gu (Durham), Iftekhar Hasan (Fordham), Yun Zhu (St. John’s), 2022
<br><br> **Abstract:**This paper explores the impact of political network on insider trading activities in China. With a comprehensive network mapping links between politicians and firm chairmen, we find that stronger political network discourages insider trading. Such effect is stronger among long-standing, high-level, and regulatory connections, and persists in the events of M&A and public policy announcement when insiders may make profitable informed trading. This suggests an insinuated rule that managers with powerful political network choose to keep a low profile in insider trading. In exploring the underlying mechanisms, we confirm that the muted insider trading is related to preferable financial and policy support, and are more pronounced in provinces with stronger market force and legal enforcement.

<input type="text" id="citation_muted_insider" style="display:none;" value="Chen, Wei and Gu, Xian and Hasan, Iftekhar and Zhao, Hao and Zhu, Yun, Political Network and Muted Insider Trading (September 27, 2022). Available at SSRN: https://ssrn.com/abstract=4230854 or http://dx.doi.org/10.2139/ssrn.4230854">
<button class="copyButton" data-clipboard-target="#citation_muted_insider">Copy Citation</button>
<span class="tooltip"></span>

<style>
  .copyButton {
    display: inline-block;
    margin-bottom: 0.25em;
    padding: 0.125em 0.25em;
    color: #438EB4;
    text-align: center;
    text-decoration: none !important;
    border: 1px solid;
    border-color: #438EB4;
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    font-size: 14px;
    vertical-align: middle;
  }

  .copyButton:hover {
    color: #fff;
    background-color: #438EB4 !important;
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
</script>



