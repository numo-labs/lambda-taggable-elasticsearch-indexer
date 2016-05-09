# lambda-taggable-cloudsearch-indexer

[![Codeship](https://img.shields.io/codeship/eb3fea00-f386-0133-6f3c-5a072c31b987.svg)](https://codeship.com/projects/149808)

Listen for updates in tags in the numo-taggy/ci S3 bucket and update CloudSearch record.

The data inserted to CloudSearch will be used to autocomplete at the tagging system and isearch-ui.

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
 export AWS_REGION=eu-west-1
 export AWS_IAM_ROLE=arn:aws:iam::12346789:role/dummy
 export AWS_ACCESS_KEY_ID=YourAccessKeyHere
 export AWS_SECRET_ACCESS_KEY=YourSecret
 ```
> replace the values for your actual ones... if you need help ask!
