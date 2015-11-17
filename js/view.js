var tempType = 'cel';

// Root layout
RootLayout = Backbone.Marionette.LayoutView.extend({

    el: '#weatherApp',

    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    },

});

// Header View
HeaderLayout = Backbone.Marionette.ItemView.extend({

    // we need template
    template: '#template-form',

    // event
    events: {
        'keypress @ui.input': 'onInputKeypress',
        'click @ui.button': 'onButtonClick',
        'click @ui.buttonGPS': 'onButtonClick',
        'click @ui.gpsLink': 'clickGPSlink',
        'keypress @ui.inputGPS': 'onInputKeypress'
    },

    // and a link to the input where the user will write the city
    ui: {
        input: '#input-city',
        button: '#city-button',
        gpsLink: '#gpsLink',
        inputGPS: '#input-gps',
        buttonGPS: '#gps-button'
    },

    onShow: function () {

        this.ui.inputGPS.hide();
        this.ui.buttonGPS.hide();
    },

    clickGPSlink: function () {

        this.ui.inputGPS.show("slow");
        this.ui.buttonGPS.show("slow");
    },

    onButtonClick: function (e) {

        if(e.currentTarget.id == "city-button"){

            // let's check if space or tab are forgotten
            var inputText = this.ui.input.val().trim();

            // if not empty
            if (this.ui.input != '') {

                // fill and add the item with the temp, desc and wind thanks to the API call
                this.trigger("header_view:callWeatherAPI", inputText);
                //reset the input content
                this.ui.input.val('');
                this.$el.hide("slow");
            }

        }
        else
        {
            // let's check if space or tab are forgotten
            var inputText = this.ui.input.val().trim();

            // if not empty
            if (this.ui.inputGPS != '') {

                // fill and add the item with the temp, desc and wind thanks to the API call
                this.trigger("header_view:callWeatherGpsAPI", inputText);
                //reset the input content
                this.ui.input.val('');
                this.$el.hide("slow");
            }
        }
    },

    // function call when user press key on the input
    onInputKeypress: function (e) {

        // enter is the 13th key 
        var ENTER_KEY = 13;

        if(e.currentTarget.id == "input-city"){

            // let's check if space or tab are forgotten
            var inputText = this.ui.input.val().trim();

            // if enter is press
            if (e.which === ENTER_KEY) {

                // fill and add the item with the temp, desc and wind thanks to the API call
                this.trigger("header_view:callWeatherAPI", inputText);
                //reset the input content
                this.ui.input.val('');

                this.$el.hide("slow");
            }

        }

        if(e.currentTarget.id == "input-gps"){

            // let's check if space or tab are forgotten
            var inputText = this.ui.inputGPS.val().trim();

            // if enter is press
            if (e.which === ENTER_KEY) {

                // fill and add the item with the temp, desc and wind thanks to the API call
                this.trigger("header_view:callWeatherGpsAPI", inputText);
                //reset the input content
                this.ui.inputGPS.val('');

                this.$el.hide("slow");
            }
        }
        
    }

});

// Main View
MainLayout = Backbone.Marionette.ItemView.extend({

    // we need template
    template: '#main-display',

    // link to the view elements
    ui: {
        city: '#city',
        temp: '#temp',
        desc: '#desc',
        wind: '#wind',
        icon: '#icon',
        google: "#googleIframContrainer",
        add: '#add',
        cel: '#cel',
        far: '#far',
        showGoogle: "#showGoogle"
    },

    // event
    events: {
        'click @ui.add': 'showHeader',
        'click @ui.cel': function (){this.convert('cel');},
        'click @ui.far': function (){this.convert('far');},
        'click @ui.showGoogle': 'showGoogleMap'
    },

    index: 0,

    setIndex: function(i) {
        this.index = i;
    },

    showHeader: function () {

        //trigger event and call controller function showHeader
        this.trigger("main_view:showHeader");
    },

    showGoogleMap: function () {

        this.ui.google.show();
    },

    // react when a view has been shown
    onShow: function() {

        // fill the DOM elements with an item of the collection
        // in function of a secified index
        this.ui.city.text(this.collection.at(this.index).getCity());
        this.ui.temp.text(this.collection.at(this.index).getTemp());
        this.ui.desc.text(this.collection.at(this.index).getDesc());
        this.ui.wind.text(this.collection.at(this.index).getWind()+ " Km/h");
        this.ui.icon.html('<img id="iconImg" alt="icon Weather" src="img/' + 
            this.collection.at(this.index).getIcon()+'.png"/>');
        this.ui.google.html('<iframe id="googleIframe" style="border: 3px solid #DDD;border-radius: 10px;-webkit-border-radius: 10px;" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCmusPkr-1TUAlI6mlGuLrp7mdkh09uSW4&amp;q=' + this.collection.at(this.index).getCity()
         + '" allowfullscreen="true" frameborder="0" height="250" width="100%"></iframe>');
        this.ui.google.hide();
    },

    convert: function (type) {

        if (type == 'cel' && tempType != 'cel') {

            var main = this;

            this.collection.each(function(model) {

                var far = model.getTemp();

                far = ((far - 32)/1.8).toFixed(1);

                model.set({temp: far});

                tempType = 'cel'

                main.trigger("footer_view:setMainIndex", main.index);

                return false;
            });
        }
        
        if (type == 'far' && tempType != 'far')
        {

            var main = this;

            this.collection.each(function(model) {

                var cel = model.getTemp();

                cel = ((cel * 1.8)+32).toFixed(1);

                model.set({temp: cel});

                tempType = 'far';

                main.trigger("footer_view:setMainIndex", main.index);

                return false;

            });
        }


    }

});

// Item view
ItemView = Backbone.Marionette.ItemView.extend({

    // we need template
    template: '#item-layout',

    ui: {

        del: '#delItem',
        show: '.list-group-item'
    },

    events: {
        'click @ui.del': 'deleteModel',
        'click @ui.show': 'showModel'
    },

    deleteModel: function () {
        this.model.destroy();
    },

    showModel: function () {

        // call the parent event with the apropriate index of collection
        this._parent.trigger("footer_view:setMainIndex", this._index);
    }

});


// Footer View (father of Item view)
FooterLayout = Backbone.Marionette.CompositeView.extend({

        template: '#list-container',

        childView: ItemView,

        childViewContainer: '#list-items',

        // link to the view elements
        ui: {
            listContainer: ".list-group"
        },
});
