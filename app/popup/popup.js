'use strict';
(function() {
  function setText(response) {
    var link_feed = document.getElementById('link_feed');
    var explainer = document.getElementById('explainer');

    if (!response || (response === 'Not Facebook')) {
      explainer.textContent = 'Visit Facebook to see ad insertion positions';
    } else if (!response.ads || response.ads.length === 0) {
      explainer.textContent = 'Scroll down or reload Facebook to see ad positions.';
    } else {
      if (link_feed.children.length > 0) {
        while (link_feed.firstChild) {
          link_feed.removeChild(link_feed.firstChild);
        }
      }

      var post_ad_avg = Math.round((response.num_posts - response.ads.length) / response.ads.length);
      var post_ad_avg_text = (post_ad_avg !== 1) ? post_ad_avg + ' organic posts' : post_ad_avg + ' organic post';
      explainer.textContent = (post_ad_avg !== 'NaN organic posts') ? '1 ad for every ' + post_ad_avg_text : 'No ads loaded yet';

      var ad_slots = response.ads;
      var ad_slot_feed_el = document.createElement('div');
      ad_slot_feed_el.id = 'ad_slot_feed';

      ad_slots.forEach(function(entry) {
        var ad_slot_el = document.createElement('div');
        ad_slot_el.className = 'ad_slot';
        ad_slot_el.textContent = 'Ad ' + ((entry.advertiser.length > 0) ? 'from ' + entry.advertiser : '') + (entry.isPlaced ? ' in slot #' + entry.placement : ' not processed yet');
        ad_slot_feed_el.appendChild(ad_slot_el);
      });

      link_feed.appendChild(ad_slot_feed_el);

      if (response.ads.length > 1) {
        chrome.storage.local.get('num_ads', function(res) {

          // TO BE REMOVED. USED TO CHECK STORAGE STATUS
          document.getElementById('cookies').textContent = '# of ads last time you submitted to database: ' + res.num_ads;

          var send_div = document.getElementById('send_stats');
          send_stats.textContent = '';

          if (response.ads.length > res.num_ads) {
            var submit_button = document.createElement('button');
            submit_button.className = 'btn';
            submit_button.textContent = 'Send';
            send_stats.appendChild(submit_button);
            submit_button.addEventListener('click', function() {
              chrome.storage.local.set({
                num_ads: response.ads.length
              });
              send_stats.removeChild(submit_button);
              send_stats.textContent = 'Load more ads to submit again.'
            });
          }
        });
      }
    }
  }

  function requestLinks() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      if (tabs[0].url.includes('facebook.com')) {
        chrome.runtime.sendMessage({
          from: 'popup',
          subject: 'sendAds',
        }, setText);
      } else {
        setText('Not Facebook');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    requestLinks();
  });

  document.getElementById('get_links').addEventListener('click', function() {
    requestLinks();
  });
})();
