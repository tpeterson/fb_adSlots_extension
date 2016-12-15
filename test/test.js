'use strict';

const expect = require('chai').expect;

describe('Query parser', function() {
  const links = [
    {
      'ft[fbfeed_location]': '1',
      'ft[insertion_position]': '1'
    },
    {
      'ft[fbfeed_location]': '1'
    },
    {
      'ft[fbfeed_location]': '3',
      'ft[insertion_position]': '3'
    }
  ];
  let final_arr = [];

  it('should set array as empty if no eligible links', function() {
    links.forEach((link)=>{
      if ( (link['ft[fbfeed_location]'] === '2') && link['ft[insertion_position]'] ) {
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
