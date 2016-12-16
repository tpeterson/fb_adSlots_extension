'use strict';

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'content_script') && (msg.subject === 'postLinks')) {
    chrome.browserAction.setBadgeText({
      text: msg.badge_num
    });
  }
});
