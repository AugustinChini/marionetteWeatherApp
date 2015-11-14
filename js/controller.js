// Controller
Controller = Backbone.Marionette.Object.extend({

    // init the controller with a new collection
    initialize: function () {
        this.cityList = new Collection();

        // view will need the event code so extend it
        _.extend(this, Backbone.Events);
        _.bindAll(this, "showMain", "showFooter", "callWeatherAPI");
    },

    // start the controller by showing the appropriate views
    start: function () {

        // fetch the data on localStorage
        this.cityList.fetch();

        // if the list is empty show only the input
        // to fill the list
        if(this.cityList.length == 0)
        {
            this.showHeader(this.cityList);
        }
        else
        {
            // if there is something on the list to display ... display it
            this.showHeader(this.cityList);
            this.showMain(this.cityList);
            this.showFooter(this.cityList);
        }

    },

    // function which show the header (the form input)
    showHeader: function (cityList) {

        // instance of the header view
        var header = new HeaderLayout({

            // link with the collection
            collection: cityList

        });

        header.bind("header_view:showMain", this.showMain);
        header.bind("header_view:showFooter", this.showFooter);
        header.bind("header_view:callWeatherAPI", this.callWeatherAPI);

        // use the root view to show the child view header
        WeatherApp.root.showChildView('header', header);
    },

    // function which show the main weather page
    showMain: function (cityList) {

        // instance of the main view
        var main = new MainLayout({

            // link with the collection
            collection: cityList
        });

        // use the root view to show the child view header
        WeatherApp.root.showChildView('main', main);
    },

    // function which show the main weather page
    showFooter: function (cityList) {

        // instance of the footer view
        var list = new FooterLayout({

            // link with the collection
            collection: cityList
        });

        // use the root view to show the child view header
        WeatherApp.root.showChildView('footer', list);
    },

    callWeatherAPI: function(city) {

        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2de143494c0b295cca9337e1e96b00e0";
        var cityList = this.cityList;
        var ctrl = this;

        $.getJSON( url, {format: "json"})
        
        .done(function( data ) {

            cityList.create({
                city: data.name,
                temp: (data.main.temp-273,15),
                desc: data.weather[0].description,
                wind: data.wind.speed
            });

            // show the main and the footer
            ctrl.showFooter(cityList);
            ctrl.showMain(cityList);

        });
    }


});