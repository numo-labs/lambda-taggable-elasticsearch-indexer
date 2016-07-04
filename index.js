'use strict';
require('env2')('.env');
var S3 = require('./lib/s3');
var es_insert = require('./lib/elasticsearch');

exports.handler = function (event, context, callback) {
  if (!event.Records) { // Check if an tag id is provided
    return callback(new Error('invalid event', JSON.stringify(event)));
  }
  // console.log('Incoming event:', JSON.stringify(event, null, 2));
  const key = event.Records[0].s3.object.key.replace(/%3A/, ':'); // adding back the :
  console.log('S3 Record Key:', key);
  S3(process.env.AWS_S3_BUCKET, key, function (err, data) {
    /* istanbul ignore next */
    if (err) { return callback(err); }
    es_insert(data, function (err, response) {
      /* istanbul ignore next */
      if (err) { return callback(err); }
      console.log(response);
      callback(null, response);
    });
  });
};
