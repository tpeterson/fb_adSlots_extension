function checkIfFacebook(url) {
  var link = parseUri(url);
  if (link.host.includes('facebook.com')) {
    return true;
  } else {
    return false;
  }
}

function getLinks() {
  var link = document.URL;
  if (checkIfFacebook(link)) {
    return get_FbAdLinks();
  } else {
    return 'Not Facebook';
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'getLinks')) {
    response(getLinks());
  }
});
