'use strict';

if (document.URL.includes('facebook.com')) {
  if (document.getElementById('mainContainer')) {
    chrome.storage.local.set({
      num_ads: 0
    });
    document.addEventListener('scroll', function() {
      var feed_info = getLinks(document.URL);
      var num_ads = (feed_info !== 'Not Facebook') ? feed_info.ads.length.toString() : '0';
      chrome.runtime.sendMessage({
        from: 'content_script',
        subject: 'postLinks',
        badge_num: num_ads,
        ad_data: feed_info
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

function parseUri(str) {
  var o = parseUri.options,
    m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
  q: {
    name: "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

function get_FbAdLinks() {
  var posts = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');

  var ad_posts = Array.from(posts).filter(function(post) {
    return post.querySelector('a._3e_2._m8c');
  });

  var ads_arr = ad_posts.map(function(post) {
    post.style.border = '4px solid #FF8080';
    let post_info = post.querySelector('a._5pb8._8o._8s.lfloat._ohe');
    // PARSE LINK WITH FEED PLACEMENT INFO
    let parsed_ad = parseUri(post_info.href);
    // PULL INFO ON ADVERTISER NAME AND FEED PLACEMENT
    let advertiser_name = (post.querySelector('span.fwb.fcg a')) ? post.querySelector('span.fwb.fcg a').textContent : '';
    let ad_obj = processAd(parsed_ad, advertiser_name);
    return ad_obj;
  });

  var feed_info = {
    num_posts: posts.length,
    ads: ads_arr
  };

  return feed_info;
}

function processAd(ad, advertiser) {
  const ad_obj = {
    advertiser: advertiser,
    isPlaced: ad.queryKey.hasOwnProperty('ft[insertion_position]'),
    placement: (ad.queryKey['ft[insertion_position]']) ? parseInt(ad.queryKey['ft[insertion_position]'], 10) + 1 : 0
  }
  return ad_obj;
}


function checkIfFacebook(url) {
  var link = parseUri(url);
  if ((link.protocol === 'https') && link.host.includes('facebook.com')) {
    return true;
  } else {
    return false;
  }
}

function getLinks(url) {
  var isFb = checkIfFacebook(url);
  if (isFb) {
    return get_FbAdLinks();
  } else {
    return 'Not Facebook';
  }
}
