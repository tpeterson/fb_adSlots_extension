'use strict';

function checkIfFacebook(url) {
  var link = parseUri(url);
  if ((link.protocol === 'https') && link.host.includes('facebook.com')) {
    return true;
  } else {
    return false;
  }
}

function getLinks(url) {
  var link = document.URL;
  if (checkIfFacebook(url) && checkIfFacebook(link)) {
    return get_FbAdLinks();
  } else {
    return 'Not Facebook';
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'getLinks')) {
    response(getLinks(msg.url));
  }
});

if (document.getElementById('mainContainer')) {
  document.addEventListener('scroll', function() {
    var feed_info = getLinks(document.URL);
    var num_ads = (feed_info !== 'Not Facebook') ? feed_info.ads.length.toString() : '0';
    chrome.runtime.sendMessage({
      from: 'content_script',
      subject: 'postLinks',
      info: feed_info,
      badge_num: num_ads
    });
  });
} else {
  chrome.runtime.sendMessage({
    from: 'content_script',
    subject: 'postLinks',
    info: [],
    badge_num: '0'
  });
}
