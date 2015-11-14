// Root layout
RootLayout = Backbone.Marionette.LayoutView.extend({

    el: '#weatherApp',

    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    }
});

// Header View
HeaderLayout = Backbone.Marionette.ItemView.extend({

    // we need template
    template: '#template-form',

    // event
    events: {
        'keypress @ui.input': 'onInputKeypress'
    },

    // and a link to the input where the user will write the city
    ui: {
        input: '#input-city'
    },

    // function call when user press key on the input
    onInputKeypress: function (e) {

        // enter is the 13th key 
        var ENTER_KEY = 13;

        // let's check if space or tab are forgotten
        var inputText = this.ui.input.val().trim();

        // if enter is press
        if (e.which === ENTER_KEY) {

            // we create new collection item
            this.collection.create({
                city: inputText
            });

            //reset the input content
            this.ui.input.val('');

            // show the main and the footer
            this.trigger("header_view:showMain", this.collection);
            this.trigger("header_view:showFooter", this.collection);
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
    },

    // react when a view has been shown
    onShow: function(){


        this.ui.city.text(this.collection.at(0).getCity());
        this.ui.temp.text(this.collection.at(0).getTemp());
        this.ui.desc.text(this.collection.at(0).getDesc());
        this.ui.wind.text(this.collection.at(0).getWind());
    }

});

// Main View
FooterLayout = Backbone.Marionette.ItemView.extend({

    // we need template
    template: '#list',

    // link to the view elements
    ui: {
        listContainer: ".list-group"
    },

    // react when a view has been shown
    onShow: function(){

        var list = this.ui.listContainer;

        // foreach item in the collection append element to listContainer
        this.collection.forEach(function (mod){
            list.append('<button type="button" class="list-group-item">' + mod.getCity() + '</button>');
        });
    }

});