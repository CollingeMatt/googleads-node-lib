var
    _ = require('lodash'),
    async = require('async'),
    soap = require('soap');

var AdWordsService = require('./adWordsService');
var types = require('../types/customerSync');

function Service(options) {
    var self = this;
    AdWordsService.call(self, options);
    self.Collection = types.collection;
    self.Model = types.model;
    // why the cm?
    self.operatorKey = 'cm:operator';
    self.mutateRemove = null;
    self.mutateSet = null;

    self.get = function (selector, callback) {

        async.waterfall(
            [
                // get client
                self.getClient,
                // Request AdWords data...
                function (client, cb) {

                    self.client.addSoapHeader(
                        self.soapHeader, self.name, self.namespace, self.xmlns
                    );

                    self.client.setSecurity(
                        new soap.BearerSecurity(self.credentials.access_token)
                    );

                    self.client.get(selector, cb);
                }
            ],
            function (err, response) {
                if (!response) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        console.log('Unknown error occurred...');
                        callback({Error: 'No response'}, null);
                    }
                }
                else {
                    var res = self.parseGetResponse(response);

                    if (err) {
                        res.error = err.body;
                    }

                    callback(null, res);
                }
            });
    }

    self.parseGetResponse = function (response) {
        if (self.validateOnly) {
            return {
                changedCampaigns: null,
                changedFeeds: null,
                lastChangeTimestamp: null,
            };
        } else {
            if (response.rval) {
                var data = response.rval;
                return {
                    changedCampaigns: data.changedCampaigns,
                    changedFeeds: data.changedFeeds,
                    lastChangeTimestamp: data.lastChangeTimestamp,
                };
            } else {
                return {};
            }
        }
    };

    self.selectable = [
        'DateTimeRange',
        'CampaignIds',
        'FeedIds'
    ];

    self.xmlns = 'https://adwords.google.com/api/adwords/ch/' + self.version;
    self.wsdlUrl = self.xmlns + '/CustomerSyncService?wsdl';
}


Service.prototype = _.create(AdWordsService.prototype, {
    'constructor': Service
});

module.exports = (Service);
