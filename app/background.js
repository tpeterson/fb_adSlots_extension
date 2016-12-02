chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'reqLinks')) {
    chrome.runtime.sendMessage({
      from: 'background',
      subject: 'getLinks'
    });
    response('background');
  }
});


chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'content_script') && (msg.subject === 'postLinks')) {
    chrome.browserAction.setBadgeText({
      text: msg.badge_num
    });
  }
});
