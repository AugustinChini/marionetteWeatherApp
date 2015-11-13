// Control the workflow and logic that exists at the application
// level, above the implementation detail of views and models
Controller = Backbone.Marionette.Object.extend({

    initialize: function () {
        this.cityList = new Collection();
    },

    // Start the app by showing the appropriate views
    start: function () {
        this.showHeader(this.cityList);
    },

    showHeader: function (cityList) {
        var header = new HeaderLayout({
            collection: cityList
        });
        WeatherApp.root.showChildView('header', header);
    }
});