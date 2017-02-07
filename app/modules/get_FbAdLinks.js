'use strict';

function get_FbAdLinks() {
  var posts = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');

  var ad_posts = Array.from(posts).filter(function(post) {
    return post.querySelector('a._3e_2._m8c');
  });

  var ads_arr = ad_posts.map(function(post) {
    post.style.border = '4px solid blue';
    let post_info = post.querySelector('a._5pb8._8o._8s.lfloat._ohe');
    // PARSE LINK WITH FEED PLACEMENT INFO
    let parsed_ad = parseUri(post_info.href);
    // PULL INFO ON ADVERTISER NAME AND FEED PLACEMENT
    let ad_obj = processAd(parsed_ad);
    return ad_obj;
  });

  var feed_info = {
    num_posts: posts.length,
    ads: ads_arr
  };

  return feed_info;
}

function processAd(ad) {
  const ad_obj = {
    advertiser: ad.directory.replace(/\//g, ''),
    isPlaced: ad.queryKey.hasOwnProperty('ft[insertion_position]'),
    placement: (ad.queryKey['ft[insertion_position]']) ? parseInt(ad.queryKey['ft[insertion_position]'], 10) + 1 : 0
  }
  return ad_obj;
}
