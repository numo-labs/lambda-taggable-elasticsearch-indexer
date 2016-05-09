'use strict';

const AWS = require('aws-sdk');
const myCredentials = new AWS.EnvironmentCredentials('AWS'); // Lambda provided credentials
const config = require('../config');
const params = {
  hosts: config.elasticsearch.endpoint, // 'https://search-taggy-ci-tro6f3n2pwinajwqcngmkulzxa.eu-west-1.es.amazonaws.com',
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: config.elasticsearch.region, // "us-east-1",
    credentials: myCredentials
  }
};
console.log(params);
const client  = new require('elasticsearch').Client(params); 
client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 3000,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

function getDocsToDelete (tagId, cb) { 
  var q = `tagid:"${tagId}"`;
  console.log(q);
  client.search({
    index: 'taggy',
    type: 'taggy',
    q: q
  }, function (err, response) {
    if (err) return cb(err);
    if(response && response.hits){
      var result = [];
      response.hits.hits.forEach(function(item){
        result.push({ delete: { _index: 'taggy', _type: 'taggy', _id: item._id } });
      });
      return cb(null, result);    
    };
    return cb(null, []);
  });
};


/**
 * Maps the s3 object into a cloudsearch document object
 * @param {object} object   s3 object to be mapped
 * @returns {{itemsToAdd: *[], itemsToDelete: *[]}}
 */
function buildCloudSearchDocument (object, cb) {

  // ToDo get documents in elasticsearch with tagid == {object._id}
  // Delete those objects before adding the new ones

  getDocsToDelete(object._id, function(err, res){
    var result = res;
    result.push({ index: { _index: 'taggy', _type: 'taggy', _id: `taggy:${object._id}` } });
      result.push({
          name: object.displayName,
          label: object.displayName,
          tagid: object._id,
          context: `taggy`,
          active: object.active
        });

      for (var marketKey in object.markets) {  // iterating markets
        for (var langKey in object.markets[marketKey]) { // iterating markets languages
          object.markets[marketKey][langKey].values.map((val, idx) => { // iterating markets languages values array
            let objToAdd = {
              type: 'add',
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
      //console.log('itemsToAdd: ', itemsToAdd);
      return cb(err, result);
  });
}

/**
 * Insert the S3 object into cloudsearch index
 * @param {object} object          s3 object to be indexed
 * @returns {Promise}
 */
exports.insertObject = function (object, cb) {
  buildCloudSearchDocument(object, function(err, csDoc) {
    client.bulk({
      body: csDoc
    }, cb);   
  });
};
