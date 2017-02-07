'use strict';

(function() {
  function setText(response) {
    var link_feed = document.getElementById('link_feed');
    var explainer = document.getElementById('explainer');

    if ( !response || (response === 'Not Facebook') ) {
      explainer.textContent = 'Visit Facebook to see ad insertion positions';
    } else if (response.ads.length === 0) {
      explainer.textContent = 'Scroll down or reload Facebook to see ad positions.';
    } else {
      while (link_feed.firstChild) {
        link_feed.removeChild(link_feed.firstChild);
      }

      var post_ad_avg = Math.round((response.num_posts - response.ads.length) / response.ads.length);
      var post_ad_avg_text = (post_ad_avg !== 1) ? post_ad_avg + ' organic posts' : post_ad_avg + ' organic post';
      var ad_avg_el = document.createElement('div');
      ad_avg_el.className = 'ad_avg';
      ad_avg_el.textContent = (post_ad_avg !== 'NaN organic posts') ? '1 ad for every ' + post_ad_avg_text : 'No ads loaded yet';
      link_feed.appendChild(ad_avg_el);

      var ad_slots = response.ads;
      var ad_slot_feed_el = document.createElement('div');
      ad_slot_feed_el.id = 'ad_slot_feed';
      link_feed.appendChild(ad_slot_feed_el);

      ad_slots.forEach(function(entry) {
        var ad_slot_el = document.createElement('div');
        ad_slot_el.className = 'ad_slot';
        ad_slot_el.textContent = 'Ad from ' + entry.advertiser + (entry.isPlaced ? ' in slot #' + entry.placement : ' isn\'t placed yet');
        ad_slot_feed_el.appendChild(ad_slot_el);
      });
    }
  }

  function requestLinks() {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
        lastFocusedWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          from: 'popup',
          subject: 'getLinks',
          url: tabs[0].url
        }, setText);
      });
  }

  document.addEventListener('DOMContentLoaded', function() {
    requestLinks();
  });

  document.getElementById('get_links').addEventListener('click', function() {
    requestLinks();
  });
})();
