'use strict';

function get_FbAdLinks() {
  var sponsored_links = document.querySelectorAll('a.uiStreamSponsoredLink');

  var checked_links = Array.from(sponsored_links).filter(function(link) {
    var cleaned_link = link.getAttribute('href');
    var parsed_link = parseUri(cleaned_link);
    return (parsed_link.queryKey['ft[fbfeed_location]'] === '1') && parsed_link.queryKey['ft[insertion_position]'];
  });

  var ad_positions = checked_links.map(function(link) {
    var cleaned_link = link.getAttribute('href');
    var parsed_link = parseUri(cleaned_link);
    var insertion_position = parsed_link.queryKey['ft[insertion_position]'];
    var ad_info = {
      ad_num: checked_links.indexOf(link) + 1,
      ad_pos: parseInt(insertion_position, 10) + 1
    };
    return ad_info;
  });
  return ad_positions;
}
