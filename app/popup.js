(function() {
  function setText(response) {
    var link_feed = document.getElementById('link_feed');

    if (response === 'Not Facebook') {
      link_feed.textContent = 'Visit Facebook to see ad insertion positions';
    } else if (!response || response.length === 0) {
      link_feed.textContent = 'Reload Facebook to see ad slots';
    } else {
      while (link_feed.firstChild) {
        link_feed.removeChild(link_feed.firstChild);
      }
      var ad_slots = response;
      for (var i = 0; i < ad_slots.length; i++) {
        var ad_slot = document.createElement('div');
        ad_slot.className = 'ad_slot';
        ad_slot.textContent = 'Ad #' + ad_slots[i].ad_num + ' appears in News Feed slot #' + ad_slots[i].ad_pos;
        link_feed.appendChild(ad_slot);
      }
    }
  }

  window.document.getElementById('get_links').addEventListener('click', function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          from: 'popup',
          subject: 'getLinks'
        }, setText);
      });
  });
})();
