var
    Backbone = require('backbone'),
    moment = require('moment');

var OfflineConversionFeed = Backbone.Model.extend({
    validate: function(attrs, options) {
        var now = moment();
        var validationErrors = [];

        if (!attrs.conversionName) {
            validationErrors.push(new Error('conversionName is required'));
        } else {
            if (
                attrs.conversionName.indexOf('\x00') +
                attrs.conversionName.indexOf('\x0A') +
                attrs.conversionName.indexOf('\x0D') > -1
            ) {
                validationErrors.push(new Error('forbidden characters in name'));
            }
        }

        // gclid
        if (!attrs.googleClickId) {
            validationErrors.push(new Error('googleClickId is required'));
        }

        // conversionTime
        if (!attrs.conversionTime) {
            validationErrors.push(new Error('conversionTime is required'));
        }

        // conversionTime
        if (!attrs.conversionValue) {
            validationErrors.push(new Error('conversionValue is required'));
        }

        if (validationErrors.length > 0) return validationErrors;
    }
});

var OfflineConversionFeedCollection = Backbone.Collection.extend({
    model: OfflineConversionFeed
});

module.exports = {
    collection: OfflineConversionFeedCollection,
    model: OfflineConversionFeed
};
