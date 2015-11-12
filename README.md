# An unofficial node library for Google AdWords
**Under development!**

## Installing the library

```bash
npm install googleads-node-lib
```

## Getting your Google AdWords access and refresh tokens
Start by getting an authorization code.  To get an authorization code (filling in client_id and selecting account), open this URL in your browser:

```
https://accounts.google.com/o/oauth2/auth?client_id=<CLIENT_ID>&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords&redirect_uri=urn:ietf:wg:oauth:2.0:oob&access_type=offline&approval_prompt=auto
```

Use this code to get tokens (filling in your Google AdWords credentials):

```bash
curl \
  -d code=<AUTHORIZATION_CODE> \
  -d client_id=<CLIENT_ID> \
  -d client_secret=<CLIENT_SECRET> \
  -d redirect_uri=urn:ietf:wg:oauth:2.0:oob \
  -d grant_type=authorization_code https://accounts.google.com/o/oauth2/token
```

This yields something like:

```JSON
{
  "access_token" : <ACCESS_TOKEN>,
  "token_type" : "Bearer",
  "expires_in" : 3599,
  "refresh_token" : <REFRESH_TOKEN>
}
```

Use the `access_token` to make requests.  The `access_token` will expire.  Use the `refresh_token` to get a new access token.  The `refresh_token` will not expire. The `refresh_token` is a stored credential.

## Authentication
This library's services get Google AdWords credentials from the following sources in priority order:
- From passed in options values:

```javascript
var AdWords = require('googleads-node-lib');

var Service = new AdWords.ManagedCustomerService({
  ADWORDS_CLIENT_ID: 'your client id',
  ADWORDS_CLIENT_CUSTOMER_ID: 'your client customer id',
  ADWORDS_DEVELOPER_TOKEN: 'your developer token'
  ADWORDS_REFRESH_TOKEN: 'your refresh token',
  ADWORDS_SECRET: 'your secret',
  ADWORDS_USER_AGENT: 'your user agent',
});
```

- Via environment variables which are either present or loaded via a `.env` file.  An example `.env` file is provided in `.env-example`.

Failure to provide credentials will cause the library to throw a configuration error.

## Using the library
In addition to this growing collection of examples, you will find other examples in the gulp tasks.

### ManagedCustomerService
Getting your managed customers:

```javascript
var AdWords = require('googleads-node-lib');
var service = new AdWords.ManagedCustomerService();
var clientCustomerId = 'the client customer ID you are interested in';

var selector = new AdWords.Selector.model({
  dateRange: {min: '19700101', max: '20380101'},
  fields: service.selectable,
  ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
  paging: {startIndex: 0, numberResults: 100},
  predicates: []
});

service.get(clientCustomerId, selector, function(err, results) {
  if (err) console.log(err);
  else console.log(JSON.stringify(results, null, 2));
});
```

Adding a managed customer:

```javascript
var AdWords = require('googleads-node-lib');
var service = new AdWords.ManagedCustomerService();
var clientCustomerId = 'the client customer ID you are interested in';
var Model = service.Model;

var operand = new Model({
  name: 'the name of the customer',
  currencyCode: 'USD',
  dateTimeZone: 'America/Chicago'
});

service.mutateAdd(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
  }
);
```

# Changelog
## 0.0.7
- caches service clients and credentials
- adds `mutateAdd` for `ManagedCustomerService`
