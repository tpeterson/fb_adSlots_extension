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
    var links = getLinks(document.URL);
    var num_links = (links !== 'Not Facebook') ? links.length.toString() : '0';
    chrome.runtime.sendMessage({
      from: 'content_script',
      subject: 'postLinks',
      info: links,
      badge_num: num_links
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
