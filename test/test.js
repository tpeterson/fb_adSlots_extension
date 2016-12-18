'use strict';

const expect = require('chai').expect;
const parseUri = require('./parseURI');

const example_links = [
  '<a class="uiStreamSponsoredLink" href="https://www.facebook.com/ads/about?ft[tn]=j&ft[qid]=6364488140059654796&ft[mf_story_key]=5062276217861793575&ft[ei]=AI%40d1fa6e8cfedf25ad6f420a0c17fec125&ft[top_level_post_id]=1630401810321511&ft[fbfeed_location]=1&ft[insertion_position]=28&__md__=0" onmousedown="this.href = this.href.replace(\'__md__=0\', \'__md__=1\');">Sponsored</a>',
  '<a class="uiStreamSponsoredLink" href="https://www.facebook.com/ads/about?ft[tn]=j&amp;ft[qid]=6364487543065961627&amp;ft[mf_story_key]=6996611655718135703&amp;ft[ei]=AI%40d04e1a998174d9bf0fe0bdf8f45980d2&amp;ft[top_level_post_id]=1330355837014694&amp;ft[fbfeed_location]=1&amp;ft[insertion_position]=15&amp;__md__=0" onmousedown="this.href = this.href.replace(\'__md__=0\', \'__md__=1\');">Sponsored</a>',
  '<a class="uiStreamSponsoredLink" href="https://www.facebook.com/ads/about?ft[tn]=j&amp;ft[qid]=6364419416790915296&amp;ft[mf_story_key]=663221508717002934&amp;ft[ei]=AI%4072e836d76c4ee6a2b4badb3dc7a4e186&amp;ft[top_level_post_id]=1870450346534048&amp;ft[fbfeed_location]=1&amp;ft[insertion_position]=1&amp;__md__=0" onmousedown="this.href = this.href.replace(\'__md__=0\', \'__md__=1\');">Sponsored</a>'
];


describe('Link parser', function() {
  it('can pick out the href attribute', function() {
    let parsed_link = parseUri(example_links[0]);
    expect(parsed_link.host).to.equal('www.facebook.com');
  });

  it('can convert to array then parse', function() {
    let filtered_links = Array.from(example_links).filter(function(link) {
      let query = parseUri(link);
      return query.queryKey['amp;ft[fbfeed_location]'] === '1';
    });
    expect(filtered_links.length).to.equal(3);
  });
});

describe('Query parser', function() {
  const queries = [];
  const final_arr = [];

  before(function() {
    example_links.forEach((link)=>{
      let query = parseUri(link);
      queries.push(query);
    });
  });

  it('should set array as empty if no eligible links', function() {
    queries.forEach((link) => {
      if ((link['ft[fbfeed_location]'] === '2') && link['ft[insertion_position]']) {
        final_arr.push(1);
      }
    });

    expect(final_arr).to.have.length(0);
  });

  it('should convert empty array to undefined', function() {
    let res = (final_arr.length > 0) ? final_arr : undefined;
    expect(res).to.be.undefined;
  });

  it('should evaluate undefined to not be true', function() {
    let res = (final_arr.length > 0) ? final_arr : undefined;
    expect(res).to.not.equal(true);
  });
});
