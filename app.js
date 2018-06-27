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
        items: [
            {id: 0, name: 'Steak Dinner', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // create id
            if(data.items.length > 0){
               ID = data.items[data.items.length - 1].id + 1;
            } else {
                console.log(data.items.length);
                ID = 0;
            }
            
            // calories to number
            calories = parseInt(calories);
            
            // create new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            
            return newItem;
        },
        logData: function(){
            return data;
        }
    }
})();

// ui controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }
    
    return {
        populateItemList: function(items){
            let html = '';
            
            items.forEach(function(item){
                html += `<li id="item-${item.id}" class="collection-item">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// app controller
const App = (function(ItemCtrl, UICtrl){
    // load event listeners
    const loadEventListeners = function(){
        // get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }
    
    // add item submit
    const itemAddSubmit = function(e){
        // get form input from ui cotroller
        const input = UICtrl.getItemInput();
        
        // check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
        }
        
        e.preventDefault();
    }
    
    // public methods
    return {
        init: function(){
//            console.log('Initializing App...');
            // fetch items from data structure
            const items = ItemCtrl.getItems();
            
            // populate list with items
            UICtrl.populateItemList(items);
            
            // Load event listeners
            loadEventListeners();
        }
    }
    
})(ItemCtrl, UICtrl);

// initialize app
App.init();