# Lambda Taggable Elasticsearch Indexer

[![Codeship](https://img.shields.io/codeship/a7841560-f843-0133-b116-52282068b433.svg)](https://codeship.com/projects/150886)

Listen for updates in tags in the numo-taggy/ci S3 bucket and update ElasticSearch record.

The data inserted to ElasticSearch will be used to autocomplete at the tagging system and isearch-ui.

Tags will be created as follows:
```js
{
  tagid: 'tagid',
  name: 'market value',
  label: 'official tag name',
  context: '`taggy` for tagging system and `market:language` for isearch-ui'
}
```
A tag will be created for each `value` in the `markets` property specified in the input data plus an additional tag with `taggy` context
for taggable-ui.

For example, with the following input:
```js
{
  "_id": "geo:geonames.1609350",
  "displayName": "Bangkok",
  "location": {
    "lat": "13.75398",
    "lon": "100.50144"
  },
  "tags": [
    {
      "node": "geo:geonames.1608132",
      "edge": "LOCATED_IN",
      "displayName": "Changwat Nonthaburi",
      "source": "geonames",
      "active": true
    }
  ],
  "markets": {
    "dk": {
      "da": {
        "label": "Bangkok",
        "values": [
          "Bangkok",
          "Vangkok"
        ]
      }
    },
    "de": {
      "de": {
        "label": "Bangkok",
        "values": [
          "Bangkok"
        ]
      }
    },
    "gb": {
      "en": {
        "label": "Angels land",
        "values": [
          "The City of Angels"
        ]
      },
      "es": {
        "label": "Bangkok",
        "values": [
          "Bangkok"
        ]
      }
    },
  }
}
 ```

 The following tags would be created:
 ```js
 {
   tagid: 'geo:geonames.1609350',
   name: 'Bangkok',
   label: 'Bangkok',
   context: 'dk:da'
 }

 {
    tagid: 'geo:geonames.1609350',
    name: 'Vangkok',
    label: 'Bangkok',
    context: 'dk:da'
 }

 {
    tagid: 'geo:geonames.1609350',
    name: 'Bangkok',
    label: 'Bangkok',
    context: 'de:de'
 }

 {
    tagid: 'geo:geonames.1609350',
    name: 'The city of Angels',
    label: 'Angels land',
    context: 'gb:en'
 }

 {
    tagid: 'geo:geonames.1609350',
    name: 'Bangkok',
    label: 'Bangkok',
    context: 'gb:es'
 }

 {
    tagid: 'geo:geonames.1609350',
    name: 'Bangkok',
    label: 'Bangkok',
    context: 'taggy'
  }

 ```

### Environment Variables

To run/develop/test this Lambda *locally* you will need to
export the following Environment Variables:

 ```sh
export AWS_ES_ENDPOINT=yourdomain.eu-west-1.es.amazonaws.com
export AWS_S3_BUCKET=numo-taggy
export AWS_REGION=eu-west-1
export AWS_IAM_ROLE=arn:aws:iam::1234567890:role/lambdafull
export AWS_ACCESS_KEY_ID=YORKIE
export AWS_SECRET_ACCESS_KEY=SuperSecret
 ```

Copy the `sample.env` to `.env` and add the valid values for the access keys.

```sh
cp sample.env .env
```
> if you don't have the keys get them from CodeShip

If you need to check if your environment variables are correct, try running:
```sh
node test/ping.js
```

