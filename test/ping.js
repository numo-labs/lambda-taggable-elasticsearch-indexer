require('env2')('.env');
console.log(process.env);
var es = require('elasticsearch').Client({
  hosts: process.env.AWS_ES_ENDPOINT,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
// console.log(es);
es.ping({
  requestTimeout: Infinity,  // ping usually has a 3000ms timeout
  // undocumented params are appended to the query string
  hello: 'elasticsearch!'
}, function (error, res) {
  if (error) {
    console.trace('ELASTICSEARCH ERROR:', error);
  } else {
    console.log('All is well', res);
  }
});
