require('env2')('.env');
var assert = require('assert');
var S3 = require('../lib/s3');

describe('S3 Get Doc from Bucket', function () {
  it('Fail (non-existent key)', function (done) {
    var key = Date.now().toString();
    S3(process.env.AWS_S3_BUCKET, key, function (err, data) {
      assert(err.statusCode === 404);
      // console.log(err, data);
      done();
    });
  });
// it('Succeed (retrieves key)', function (done) {
// 	var key = Date.now().toString();
// 	S3(process.env.AWS_S3_BUCKET, key, function (err, data) {
// 		// console.log(err, data);
// 		done();
// 	});
// });
});
