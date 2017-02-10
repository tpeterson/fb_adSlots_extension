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
  // var link = document.URL;
  // && checkIfFacebook(link)
  var isFb = checkIfFacebook(url);
  if (isFb) {
    return get_FbAdLinks();
  } else {
    return 'Not Facebook';
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'getLinks')) {
    var returned_links = getLinks(msg.url);
    response(returned_links);
  }
});

if (document.URL.includes('facebook.com')) {
  if (document.getElementById('mainContainer')) {
    chrome.storage.sync.set({num_ads: 0});
    document.addEventListener('scroll', function() {
      var feed_info = getLinks(document.URL);
      var num_ads = (feed_info !== 'Not Facebook') ? feed_info.ads.length.toString() : '0';
      chrome.runtime.sendMessage({
        from: 'content_script',
        subject: 'postLinks',
        badge_num: num_ads
      });
    });
  }
} else {
  chrome.runtime.sendMessage({
    from: 'content_script',
    subject: 'postLinks',
    badge_num: '0'
  });
}
