var
  _ = require('lodash'),
  async = require('async'),
  soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/offlineConversionFeed');

function Service(options) {
  var self = this;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;

  // This service doesn't support GET or REMOVE
  self.mutateRemove = function(clientCustomerId, operand, done) {
      throw new Error('remove is not supported on OfflineConversionFeedService');
  };

  self.mutateSet = function(clientCustomerId, operand, done) {
      throw new Error('set is not supported on OfflineConversionFeedService');
  };

  self.get = function(clientCustomerId, operand, done) {
      throw new Error('get is not supported on OfflineConversionFeedService');
  };

  self.parseMutateResponse = function(response) {
    if (self.validateOnly) {
      return {
        partialFailureErrors: null,
        value: null
      };
    } else {
      if (response.rval) {
        return {
          partialFailureErrors: response.rval.partialFailureErrors,
          value: new self.Collection(response.rval.value)
        };
      } else {
        return {};
      }
    }
  };

  self.selectable = [
    'GoogleClickId',
    'ConversionName',
    'ConversionTime',
    'ConversionValue',
    'ConversionCurrencyCode'
  ];

  self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
  self.wsdlUrl = self.xmlns + '/OfflineConversionFeedService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  'constructor': Service
});

module.exports = (Service);
