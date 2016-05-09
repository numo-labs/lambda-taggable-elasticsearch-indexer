'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var s3 = new AWS.S3();

/**
 * Given a bucket and a key, returns a promise with the object.
 * @param {string} bucket   aws s3 bucket
 * @param {string} key      object to retrieve key
 * @returns {Promise}
 */
exports.getObjectByKey = (bucket, key, cb) => {
  s3.getObject({ Bucket: bucket, Key: key }, function (err, data) {
    if (err) return cb(err);
    cb(err, JSON.parse(data.Body.toString()));
  });
};
