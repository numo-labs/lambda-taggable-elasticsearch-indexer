'use strict';

const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION;
var s3 = new AWS.S3();

/**
 * Given a bucket and a key, returns a promise with the object.
 * @param {String} bucket  aws s3 bucket
 * @param {String} key     object to retrieve key
 * @param {Function} cb    callback with error and result
 */
exports.getObjectByKey = (bucket, key, cb) => {
  s3.getObject({ Bucket: bucket, Key: key }, function (err, data) {
    if (err) return cb(err);
    cb(err, JSON.parse(data.Body.toString()));
  });
};
