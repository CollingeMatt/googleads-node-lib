var Backbone = require('backbone');

var CustomerAsync = Backbone.Model.extend({
    validate: function(attrs, options) {
        var validationErrors = [];
        console.log(attrs);
        if (!attrs.dateTimeRange) validationErrors.push(
            Error('dateTimeRange required')
        );

        if (!(attrs.campaignIds || attrs.feedIds)) validationErrors.push(
            Error('either campaignIds or feedIds required')
        );

        if (validationErrors.length > 0) return validationErrors;
    }
});

var CustomerAsyncCollection = Backbone.Collection.extend({
    model: CustomerAsync,
});

module.exports = {
    collection: CustomerAsyncCollection,
    model: CustomerAsync
};
