(function() {
  // CHECK IF CURRENT PAGE IS FACEBOOK
  if (document.URL.includes('facebook.com')) {
    if (document.getElementById('mainContainer')) {
      // SET OR RESET STORED DATA TRACKING SUBMISSIONS TO DATABASE
      chrome.storage.local.set({
        num_ads: 0
      });
      // UPDATE DATA AS FACEBOOK LOADS MORE ADS/POSTS ON SCROLL
      document.addEventListener('scroll', function() {
        // PROCESS ADS/POSTS
        var feed_info = getLinks(document.URL);
        // PARSE NUMBER OF ADS TO APPEAR IN EXTENSION BADGE
        var num_ads = feed_info ? feed_info.ads.length.toString() : '0';
        // SEND DATA TO EVENT PAGE (BACKGROUND.JS)
        chrome.runtime.sendMessage({
          from: 'content_script',
          subject: 'postLinks',
          badge_num: num_ads,
          ad_data: feed_info
        });
      });
    }
  } else {
    // SET BADGE NUMBER TO 0 IF NOT FACEBOOK
    chrome.runtime.sendMessage({
      from: 'content_script',
      subject: 'postLinks',
      badge_num: '0'
    });
  }
  // CONVERT LINK INTO PARSEABLE OBJECT
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
  // PROCESS ADS/POSTS
  function get_FbAdLinks() {
    // GET LIST OF ALL POSTS IN FEED, INCLUDING ADS
    var posts = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');
    // FILTER POSTS LISTS FOR ADS
    var ad_posts = Array.from(posts).filter(function(post) {
      return post.querySelector('a._3e_2._m8c');
    });
    // PROCESS ADS
    var ads_arr = ad_posts.map(function(post) {
      // HIGHLIGHT ADS IN FEED
      post.style.border = '4px solid #FF8080';
      // GET CHILD THAT CONTAINS AD INFO
      var post_info = post.querySelector('a._5pb8._8o._8s.lfloat._ohe');
      // GET FEED PLACEMENT INFO FROM THAT CHILD
      var parsed_ad = parseUri(post_info.href);
      // GET ADVERTISER NAME FROM THAT CHILD
      var advertiser_name = (post.querySelector('span.fwb.fcg a')) ? post.querySelector('span.fwb.fcg a').textContent : '';
      // SEND FEED PLACEMENT INFO AND ADVERTISER NAME FOR PROCESSING
      var ad_obj = processAd(parsed_ad, advertiser_name);
      // ADD PROCESSED AD OBJECT TO ARRAY
      return ad_obj;
    });
    // CONVERT DATA INTO OBJECT: NUM_POSTS FOR BADGE AND AD LOAD, ADS FOR ITEMIZED LIST IN POPUP
    var feed_info = {
      num_posts: posts.length,
      ads: ads_arr
    };

    return feed_info;
  }
  // CONVERT AD DATA INTO OBJECT FOR ITEMIZED LIST IN POPUP
  function processAd(ad, advertiser) {
    const ad_obj = {
      advertiser: advertiser,
      isPlaced: ad.queryKey.hasOwnProperty('ft[insertion_position]'),
      placement: (ad.queryKey['ft[insertion_position]']) ? parseInt(ad.queryKey['ft[insertion_position]'], 10) + 1 : 0
    }
    return ad_obj;
  }
  // CHECK THAT GETTING LINKS FOR FACEBOOK. WILL BE MODIFIED ONCE TWITTER ADDED TO EXTENSION
  function checkIfFacebook(url) {
    // CONVERT LINK INTO OBJECT
    var link = parseUri(url);
    // CHECK THAT LINK IS FOR SECURE FACEBOOK SITE
    if ((link.protocol === 'https') && link.host.includes('facebook.com')) {
      return true;
    } else {
      return false;
    }
  }
  // GRAB AD/POST DATA
  function getLinks(url) {
    // VERIFY THAT CHECKING FOR FACEBOOK. WILL BE MODIFIED ONCE TWITTER ADDED
    var isFb = checkIfFacebook(url);
    if (isFb) {
      return get_FbAdLinks();
    } else {
      return false;
    }
  }
})();
