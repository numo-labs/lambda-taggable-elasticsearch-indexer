require('env2')('.env');
var assert = require('assert');
var es = require('../lib/elasticsearch');

describe('ElasticSearch retrieve records by tagId', function () {
  it('Fail (non-existent tagId)', function (done) {
    var key = Date.now().toString();
    es.getDocsToDelete(key, function (err, data) {
      // console.log(err, data);
      assert(!err);
      assert.deepEqual(data, []);
      done();
    });
  });
});
