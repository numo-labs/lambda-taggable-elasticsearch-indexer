require('env2')('.env')
var es = require('elasticsearch').Client({
  hosts: process.env.AWS_ES,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
// console.log(es);

es.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,
  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});