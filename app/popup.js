(function() {
  function setText(response) {
    var link_feed = document.getElementById('link_feed');
    var explainer = document.getElementById('explainer');

    if (response === 'Not Facebook') {
      explainer.textContent = 'Visit Facebook to see ad insertion positions';
    } else if (!response || response.length === 0) {
      explainer.textContent = 'Reload Facebook to see ad slots';
    } else {
      while (link_feed.firstChild) {
        link_feed.removeChild(link_feed.firstChild);
      }

      var ad_slots = response;

			var ad_slot_feed_el = document.createElement('div');
			ad_slot_feed_el.id = 'ad_slot_feed';

			var post_ad_avg = (ad_slots[ad_slots.length - 1].ad_pos) / ad_slots.length;
			var ad_avg_el = document.createElement('div');
			ad_avg_el.className = 'ad_avg';
			ad_avg_el.textContent = 'Organic posts per ad ratio: ' + post_ad_avg;

			link_feed.appendChild(ad_avg_el);
			link_feed.appendChild(ad_slot_feed_el);

			ad_slots.forEach(function(entry) {
				var ad_slot_el = document.createElement('div');
				ad_slot_el.className = 'ad_slot';
				ad_slot_el.textContent = 'Ad #' + entry.ad_num + ' => News Feed slot #' + entry.ad_pos;
        ad_slot_feed_el.appendChild(ad_slot_el);
				// setTimeout(() => {
				// 	ad_slot_feed_el.appendChild(ad_slot_el);
				// }, 150 * ad_slots.indexOf(entry));
			});
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
