'use strict';
require('env2')('.env');
var AwsHelper = require('aws-lambda-helper');
var log = AwsHelper.Logger('elasticsearch');
var elasticsearch = require('elasticsearch');
// const AWS = require('aws-sdk');
// const myCredentials = new AWS.EnvironmentCredentials('AWS'); // Lambda provided credentials

const params = {
  hosts: process.env.AWS_ES_ENDPOINT, // 'https://search-taggy-ci-tro6f3n2pwinajwqcngmkulzxa.eu-west-1.es.amazonaws.com',
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: process.env.AWS_REGION,
    // credentials: myCredentials
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};
console.log(params);
const client = new elasticsearch.Client(params);

function getDocsToDelete (tagId, cb) {
  var q = `tagid:"${tagId}"`;
  console.log(q);
  client.search({
    index: 'taggy',
    type: 'taggy',
    q: q
  }, function (err, response) {
    if (err) return cb(err);
    if (response && response.hits) {
      var result = [];
      response.hits.hits.forEach(function (item) {
        result.push({ delete: { _index: 'taggy', _type: 'taggy', _id: item._id } });
      });
      return cb(null, result);
    }
    return cb(null, []);
  });
}

/**
 * Maps the s3 object into a cloudsearch document object
 * @param {object} object   s3 object to be mapped
 * @returns {{itemsToAdd: *[], itemsToDelete: *[]}}
 */
function prepare_records (object, cb) {
  // ToDo get documents in elasticsearch with tagid == {object._id}
  // Delete those objects before adding the new ones
  getDocsToDelete(object._id, function (err, result) {
    result.push({ index: { _index: 'taggy', _type: 'taggy', _id: `taggy:${object._id}` } });
    result.push({
      name: object.displayName,
      label: object.displayName,
      tagid: object._id,
      context: 'taggy',
      active: object.active
    });

    for (var marketKey in object.markets) {  // iterating markets
      for (var langKey in object.markets[marketKey]) { // iterating markets languages
        object.markets[marketKey][langKey].values.map((val, idx) => { // iterating markets languages values array
          let objToAdd = {
            // type: 'add',
            id: `${marketKey}:${langKey}:${idx}:${object._id}`,
            fields: {
              name: val,
              label: object.markets[marketKey][langKey].label,
              tagid: object._id,
              context: `${marketKey}:${langKey}`,
              active: object.active
            }
          };
          result.push({ index: { _index: 'taggy', _type: 'taggy', _id: objToAdd.id } });
          result.push(objToAdd.fields);
        });
      }
    }
    // console.log('itemsToAdd: ', itemsToAdd);
    return cb(err, result);
  });
}

/**
 * Insert the S3 object into cloudsearch index
 * @param {object} object          s3 object to be indexed
 * @returns {Promise}
 */
exports.insertObject = function (object, cb) {
  prepare_records(object, function (err, csDoc) {
    log.info(err);
    client.bulk({
      body: csDoc
    }, cb);
  });
};
