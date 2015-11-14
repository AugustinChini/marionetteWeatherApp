// Model
Model = Backbone.Model.extend({

    // struct of the collection item (default constructor)
    defaults: {
        city: '',
        temp: 0,
        desc: 'Desc temp',
        wind: 'wind .....'
    },

    // getters
    getCity: function(){
        return this.get('city');
    },

    getTemp: function(){
        return this.get('temp');
    },

    getDesc: function(){
        return this.get('desc');
    },

    getWind: function(){
        return this.get('wind');
    }


});

// Collection
Collection = Backbone.Collection.extend({

    //link with a model
    model: Model,

    // we want to store the collection in a local storage
    localStorage: new Backbone.LocalStorage('weather-List'),

});