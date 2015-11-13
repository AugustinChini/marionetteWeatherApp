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

    template: '#template-form',

    events: {
        'keypress @ui.input': 'onInputKeypress'
    },

    ui: {
        input: '#input-city'
    },


    onInputKeypress: function (e) {

        var ENTER_KEY = 13;

        var inputText = this.ui.input.val().trim();

        if (e.which === ENTER_KEY) {
                this.collection.create({
                    city: inputText
                });
                this.ui.input.val('');
        }
        
    }

});