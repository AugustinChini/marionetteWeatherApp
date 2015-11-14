// create the app object
var App = Backbone.Marionette.Application.extend({

		// function which set the root layout in root var
        setRootLayout: function () {
            this.root = new RootLayout();
        }
});

// instance of the app
var WeatherApp = new App();

// we must attach the root layout before the app starting
WeatherApp.on('before:start', function () {

        WeatherApp.setRootLayout();
});


// After initialization of the app we can start it
WeatherApp.on('start', function () {

	// instance of the controller
    var controller = new Controller();

    // start the contolleur
    controller.start();

    // start the history of router navigation
    Backbone.history.start();
});

// start the TodoMVC app (defined in js/TodoMVC.js)
WeatherApp.start();