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
//            {id: 0, name: 'Steak Dinner', calories: 1200},
//            {id: 1, name: 'Cookie', calories: 400},
//            {id: 2, name: 'Eggs', calories: 300}
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
        getItemById: function(id){
            let found = null;
            // loop though items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            });
            // set total calories in data structure
            data.totalCalories = total;
            
            // return total
            return data.totalCalories;
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
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn'
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
        addListItem: function(item){
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        
        showTotalCAlories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';            
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
        
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
        
    }
    
    // add item submit
    const itemAddSubmit = function(e){
        // get form input from ui cotroller
        const input = UICtrl.getItemInput();
        
        // check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add item to UI list
            UICtrl.addListItem(newItem);
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to ui
            UICtrl.showTotalCAlories(totalCalories);
            
            
            //clear fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }
    
    // update item submit
    const itemUpdateSubmit = function(e){
        if(e.target.classList.contains('edit-item')){
            // get list item id
            const listId = e.target.parentNode.parentNode.getAttribute('id');
            // break into an array
            const listIdArray = listId.split('-');
            // get the actual id
            const id = parseInt(listIdArray[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    
    // public methods
    return {
        init: function(){
            // clear edit state / set initial set
            UICtrl.clearEditState();
//            console.log('Initializing App...');
            // fetch items from data structure
            const items = ItemCtrl.getItems();
            
            // check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }
            
//            // populate list with items
//            UICtrl.populateItemList(items);
            
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to ui
            UICtrl.showTotalCAlories(totalCalories);
            
            // Load event listeners
            loadEventListeners();
        }
    }
    
})(ItemCtrl, UICtrl);

// initialize app
App.init();