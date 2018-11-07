var
  _ = require('lodash'),
  async = require('async'),
  soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/customer');

function Service(options) {
  var self = this;
  var Selector = require('../types/selector').model;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;

  // why the cm?
  self.operatorKey = 'cm:operator';
  self.mutateRemove = null;
  self.mutateSet = null;

  self.getCustomers = function(selector, done) {
      //self.soapHeader.RequestHeader.clientCustomerId = clientCustomerId;
      async.waterfall([
            // get client
            self.getClient,
            // Request AdWords data...
            function(client, cb) {
                self.client.addSoapHeader(
                    self.soapHeader, self.name, self.namespace, self.xmlns
                );

                self.client.setSecurity(
                    new soap.BearerSecurity(self.credentials.access_token)
                );

                self.client.getCustomers(self.formGetRequest(selector), cb);
            }
        ],
        function(err, response) {
            return done(err, self.parseGetResponse(response));
        });
  };

  self.parseGetResponse = function(response) {
    if (self.validateOnly) {
      return {
        entries: null,
        links: null,
        'Page.Type': null,
        totalNumEntries: null

      };
    } else {
      if (response.rval) {
        return {
          entries: new self.Collection(response.rval.entries),
          links: new self.Collection(response.rval.links),
          'Page.Type': response.rval['Page.Type'],
          totalNumEntries: response.rval.totalNumEntries
        };
      } else {
        return {};
      }
    }
  };

  self.parseMutateResponse = function(response) {
    if (self.validateOnly) {
      return {
        value: null
      };
    } else {
      if (response.rval) {
        return {
          value: new self.Collection(response.rval.value)
        };
      } else {
        return {};
      }
    }
  };

  self.parseMutateLinkResponse = function(response) {
    if (self.validateOnly) {
      return {
        links: null
      };
    } else {
      if (response.rval) {
        return {
          links: new self.Collection(response.rval.links)
        };
      } else {
        return {};
      }
    }
  };

  self.selectable = [
      'CustomerId',
      'CurrencyCode',
      'DateTimeZone',
      'DescriptiveName',
      'CanManageClients',
      'TestAccount'
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/mcm/' + self.version;
  self.wsdlUrl = self.xmlns + '/CustomerService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  'constructor': Service
});

module.exports = (Service);
