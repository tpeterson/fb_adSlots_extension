'use strict';
(function() {
  // PRESENT AD/POST DATA IN POPUP
  function setText(response) {
    var link_feed = document.getElementById('link_feed');
    var explainer = document.getElementById('explainer');
    // IF NO RESPONSE OR PAGE IS NOT FACEBOOK
    if (!response) {
      explainer.textContent = 'Visit Facebook to see ad insertion positions';
    // IF NO ADS HAVE LOADED ON FACEBOOK YET
    } else if (!response.ads || response.ads.length === 0) {
      explainer.textContent = 'Scroll down or reload Facebook to see ad positions.';
    // IF ADS HAVE LOADED ON FACEBOOK
    } else {
      // CLEAR ITEMIZED LIST OF ADS FROM LAST TIME
      if (link_feed.children.length > 0) {
        while (link_feed.firstChild) {
          link_feed.removeChild(link_feed.firstChild);
        }
      }
      // CALCULATE AD LOAD AND PRESENT IN POPUP
      var post_ad_avg = Math.round((response.num_posts - response.ads.length) / response.ads.length);
      var post_ad_avg_text = (post_ad_avg !== 1) ? post_ad_avg + ' organic posts' : post_ad_avg + ' organic post';
      explainer.textContent = (post_ad_avg !== 'NaN organic posts') ? '1 ad for every ' + post_ad_avg_text : 'No ads loaded yet';
      // CREATE ITEMIZED LIST OF ADS
      var ad_slots = response.ads;
      var ad_slot_feed_el = document.createElement('div');
      ad_slot_feed_el.id = 'ad_slot_feed';
      ad_slots.forEach(function(entry) {
        var ad_slot_el = document.createElement('div');
        ad_slot_el.className = 'ad_slot';
        ad_slot_el.textContent = 'Ad ' + ((entry.advertiser.length > 0) ? 'from ' + entry.advertiser : '') + (entry.isPlaced ? ' in slot #' + entry.placement : ' not processed yet');
        ad_slot_feed_el.appendChild(ad_slot_el);
      });
      // ADD ITEMIZED LIST OF ADS TO POPUP
      link_feed.appendChild(ad_slot_feed_el);
      // CHECK IF THERE ARE ENOUGH ADS FOR DATA TO BE SUBMITTED TO DATABASE
      if (response.ads.length > 1) {
        // CHECK STORED DATA
        chrome.storage.local.get('num_ads', function(res) {
          // TO BE REMOVED. USED TO CHECK STORAGE STATUS
          document.getElementById('storage_status').textContent = '# of ads last time you submitted to database: ' + res.num_ads;
          // CLEAR ELEMENT THAT INFORMS WHY SEND BUTTON HAS BEEN REMOVED
          var send_div = document.getElementById('send_stats');
          send_stats.textContent = '';
          // CHECK IF NEW ADS HAVE BEEN LOADED SINCE LAST TIME SUBMITTED TO DATABASE
          if (response.ads.length > res.num_ads) {
            // CREATE SUBMIT BUTTON
            var submit_button = document.createElement('button');
            submit_button.className = 'btn';
            submit_button.textContent = 'Submit ad load';
            send_stats.appendChild(submit_button);
            // REMOVE SUBMIT BUTTON EACH TIME DATA IS SUBMITTED TO DATABASE AND UPDATE STORED DATA
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
  // IF ACTIVE TAB IS FACEBOOK, REQUEST DATA FROM EVENT PAGE (BACKGROUND.JS)
  function requestLinks() {
    // GET LIST OF ACTIVE TABS AND CURRENT WINDOW
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      // CHECK THAT PAGE IS FACEBOOK
      if (tabs[0].url.includes('facebook.com')) {
        // SEND MESSAGE TO EVENT PAGE
        chrome.runtime.sendMessage({
          from: 'popup',
          subject: 'sendAds',
        }, setText);
      } else {
        // FLAG IF NOT FACEBOOK
        setText(false);
      }
    });
  }
  // FIRE WHEN POPUP IS OPENED
  document.addEventListener('DOMContentLoaded', function() {
    requestLinks();
  });
  // FIRE WHEN REFRESH BUTTON IS CLICKED
  document.getElementById('get_links').addEventListener('click', function() {
    requestLinks();
  });
})();
