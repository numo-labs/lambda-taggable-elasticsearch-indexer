'use strict';

const config = require('./config.js');
var S3 = require('./lib/s3');
var elasticsearch = require('./lib/elasticsearch');

exports.handler = function (event, context, cb) {
  console.log('Incoming event', JSON.stringify(event));
  const key = event.Records[0].s3.object.key.replace(/%3A/, ':'); // adding back the :
  S3.getObjectByKey(config.S3.bucket, key, function(err, data) { 
    elasticsearch.insertObject(data, function(err, data){
      cb(err, data);
    });
  })
};
