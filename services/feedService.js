var
    _ = require('lodash'),
    async = require('async'),
    soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/feed');

function Service(options) {
    var self = this;
    AdWordsService.call(self, options);
    self.Collection = types.collection;
    self.Model = types.model;

    self.get = function (selector, callback) {
        async.waterfall([
                self.getClient,
                function (client, callback) {
                    self.client.addSoapHeader(
                        self.soapHeader, self.name, self.namespace, self.xmlns
                    );

                    self.client.setSecurity(
                        new soap.BearerSecurity(self.credentials.access_token)
                    );

                    self.client.get(selector, callback);
                }
            ],
            function (error, response) {
                var res = self.parseGetResponse(response);

                return callback(null, res);
            })
    }

    self.mutateRemove = function(clientCustomerId, operand, done) {
        operand.set('status', 'REMOVED');
        self.mutateSet(clientCustomerId, operand, done);
        return;
    };

    self.parseGetResponse = function(response) {
        if (self.validateOnly) {
            return {
                entries: null
            };
        } else {
            if (response.rval) {
                return {
                    entries: new self.Collection(response.rval.entries),
                };
            } else {
                return {};
            }
        }
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

    self.parseQueryResponse = function(response) {
        return self.parseGetResponse(response);
    };

    self.selectable = [
        'Id',
        'Name',
        'Attributes',
        'FeedStatus',
        'Origin',
        'SystemFeedGenerationData'
    ];

    self.xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
    self.wsdlUrl = self.xmlns + '/FeedService?wsdl';
}

Service.prototype = _.create(AdWordsService.prototype, {
    'constructor': Service
});

module.exports = (Service);
