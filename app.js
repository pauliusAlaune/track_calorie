// storage controller

// item controller
const ItemCtrl = (function(){
    // item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }    
    // data structure / state
    const data = {
        item: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null
        totalCalories: 0
    }
    return {
        logData: function(){
            return data;
        }
    }
})();

// ui controller
const UICtrl = (function(){
    return {
        
    }
})();

// app controller
const App = (function(ItemCtrl, UICtrl){
    
    // public methods
    return {
        init: function(){
            console.log('Initializing App...');
        }
    }
    
})(ItemCtrl, UICtrl);

// initialize app
App.init();