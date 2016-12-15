function get_FbAdLinks() {
  var sponsored_links = document.querySelectorAll('a.uiStreamSponsoredLink');
  var ad_positions = [];

  for (var i = 0; i < sponsored_links.length; i++) {
    var parsed_link = parseUri(sponsored_links[i]);
    if ((parsed_link.queryKey['ft[fbfeed_location]'] === '1') && parsed_link.queryKey['ft[insertion_position]']) {
      var insertion_position = parsed_link.queryKey['ft[insertion_position]'];
      var ad_info = {
        ad_num: parseInt(i, 10) + 1,
        ad_pos: parseInt(insertion_position, 10) + 1
      };
      ad_positions.push(ad_info);
    } else {
      return ad_positions; // MAY NOT NEED ELSE STATEMENT
    }
  }
  return ad_positions;
}
