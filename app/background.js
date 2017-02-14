'use strict';

var ad_load = {};

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'content_script') && (msg.subject === 'postLinks')) {
    ad_load = msg.ad_data;
    chrome.browserAction.setBadgeText({
      text: msg.badge_num
    });
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'sendAds')) {
    response(ad_load);
  }
});
