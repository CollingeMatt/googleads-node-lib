var
  _ = require('lodash'),
  async = require('async'),
  soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/campaignEstimates');

function Service(options) {
  var self = this;
  AdWordsService.call(self, options);
  self.Collection = types.collection;
  self.Model = types.model;
  self.pageKey = 'campaignEstimates';
  self.selectable = null;
  self.xmlns = 'https://adwords.google.com/api/adwords/o/' + self.version;
  self.wsdlUrl = self.xmlns + '/TrafficEstimatorService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
  'constructor': Service
});

module.exports = (Service);