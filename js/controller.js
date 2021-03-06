// API ID if the current id is out of date please change this key
var APP_ID = "2de143494c0b295cca9337e1e96b00e0";



// Controller
Controller = Backbone.Marionette.Object.extend({

    // init the controller with a new collection
    initialize: function () {
        this.cityList = new Collection();

        // view will need the event code so extend it
        _.extend(this, Backbone.Events);
        _.bindAll(this, "callWeatherAPI", "setMainIndex", "callWeatherGpsAPI", "showHeader");
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
            //index of the collection we want to display
            this.showMain(this.cityList, 0);
            this.showFooter(this.cityList);
        }

    },

    hideHeader: function () {

        WeatherApp.root.header.$el.hide("slow");
    },

    // function which show the header (the form input)
    showHeader: function (cityList) {
        
        // If header object is empty create an instance of it
        if (WeatherApp.root.header.$el.length == 1) {
            // instance of the header view
            var header = new HeaderLayout({

                // link with the collection
                collection: cityList

            });

            //bind header view with the API call function
            header.bind("header_view:callWeatherAPI", this.callWeatherAPI);
            header.bind("header_view:callWeatherGpsAPI", this.callWeatherGpsAPI);

            // use the root view to show the child view header
            WeatherApp.root.showChildView('header', header);
        }

        // else juste show elements
        else{
            WeatherApp.root.header.$el.show("slow");
        }
    },

    // function which show the main weather page
    showMain: function (cityList, index) {

        // instance of the main view
        var main = new MainLayout({

            // link with the collection
            collection: cityList
        });

        //bind header view with the API call function
        main.bind("main_view:showHeader", this.showHeader);
        main.bind("footer_view:setMainIndex", this.setMainIndex);

        //set the selected index on the main view
        //to choose the Item to display
        main.setIndex(index);

        // use the root view to show the child view header
        WeatherApp.root.showChildView('main', main);
    },

    // dislay the main view with the appropriate index
    setMainIndex: function (i) {

        this.showMain(this.cityList, i);
    },

    // function which show the main weather page
    showFooter: function (cityList) {

        // instance of the footer view
        var list = new FooterLayout({

            // link with the collection
            collection: cityList
        });

        list.bind("footer_view:setMainIndex", this.setMainIndex);

        // use the root view to show the child view header
        WeatherApp.root.showChildView('footer', list);
    },

    callWeatherAPI: function ( city ) {

        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+APP_ID;
        var ctrl = this;

        $.getJSON( url, {format: "json"})
        
        .done(function( data ) {

            ctrl.addItemList(data, ctrl);
        });
    },

    callWeatherGpsAPI: function ( coor ) {

        var url = "http://api.openweathermap.org/data/2.5/weather?" + coor + "&appid="+APP_ID;
        var ctrl =this;

        $.getJSON( url, {format: "json"})
        
        .done(function( data ) {

            ctrl.addItemList(data, ctrl);
        });
    },


    addItemList: function (data, ctrl) {

        // if the query return a success code
        if(data.cod == "200") {

            var i = 0;

            var cityList = ctrl.cityList;

            // destroy duplication in the list
            while ( i < cityList.length && i != -1) {
                if(cityList.at(i).getCity() == data.name) {

                    cityList.at(i).destroy();
                    i = -2;
                }

                ++i;
            }

            cityList.create({
                city: data.name,
                temp: (data.main.temp - 273.15).toFixed(1),
                desc: data.weather[0].description,
                wind: data.wind.speed,
                icon: data.weather[0].icon
            });

            // show the main and the footer
            ctrl.showFooter(cityList);
            ctrl.showMain(cityList, cityList.length-1);
        }
        else
        {
            alert("The form does not appear correctly filled.");
        }
    }


});