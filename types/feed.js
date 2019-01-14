var
    Backbone = require('backbone'),
    moment = require('moment');

var Feed = Backbone.Model.extend({
    validate: function(attrs, options) {
        var now = moment();
        var validationErrors = [];

        // TODO: Validators.

        if (validationErrors.length > 0) return validationErrors;
    }
});

var FeedCollection = Backbone.Collection.extend({
    model: Feed,
});

module.exports = {
    collection: FeedCollection,
    model: Feed
};
