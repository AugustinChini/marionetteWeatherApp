// Model
Model = Backbone.Model.extend({

    defaults: {
        city: '',
        temp: 0,
        desc: '',
        wind: ''
    },
});

Collection = Backbone.Collection.extend({

        model: Model,

        localStorage: new Backbone.LocalStorage('weather-backbone-marionette'),

});