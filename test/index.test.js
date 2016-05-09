var assert = require('assert');
var handler = require('../index').handler;
var event = require('./fixtures/sample_event');

describe('Index handler tests', function () {
  it('Context.fail: called when no id is provided in the event', function (done) {
    handler({}, {}, function (err, data) {
      assert.equal(err.message, 'invalid event');
      done();
    });
  });

  it('Context.succeed: called with the newTagDoc', function (done) {
    handler(event, {}, function (err, data) {
      assert(!err);
      // console.log(err, data);
      assert(data.errors === false);
      assert(data.items.length === 4);
      done();
    });
  });
});
