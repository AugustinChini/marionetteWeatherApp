var App = Backbone.Marionette.Application.extend({

        setRootLayout: function () {
            this.root = new RootLayout();
        }
});
    
var WeatherApp = new App();

WeatherApp.on('before:start', function () {

        WeatherApp.setRootLayout();
});


// After we initialize the app, we want to kick off the router
// and controller, which will handle initializing our Views
WeatherApp.on('start', function () {

    var controller = new Controller();

    controller.start();
    Backbone.history.start();
});

// start the TodoMVC app (defined in js/TodoMVC.js)
WeatherApp.start();