// storage controller
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                // push new item
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);
                
                // re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStogare: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updateItem){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(updateItem.id === item.id){
                    items.splice(index, 1, updateItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

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
//        items: [
////            {id: 0, name: 'Steak Dinner', calories: 1200},
////            {id: 1, name: 'Cookie', calories: 400},
////            {id: 2, name: 'Eggs', calories: 300}
//        ],
        items: StorageCtrl.getItemsFromStogare(),
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
        updateItem: function(name, calories){
            // calories to number
            calories = parseInt(calories);
            
            let found = null;
            
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            // get the ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            
            // get the index
            const index = ids.indexOf(id);
            // remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
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
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // turn node list into array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
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
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
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
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // load event listeners
    const loadEventListeners = function(){
        // get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        
        // disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        
        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        
        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        
        // clear list item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
        
        // back btn item event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
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
            // store in localStorage
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }
    
    // click edit item
    const itemEditClick = function(e){
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
    
    // update item submit
    const itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();
        // update item
        const updateItem = ItemCtrl.updateItem(input.name, input.calories);
        // update ui
        UICtrl.updateListItem(updateItem);
        
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCAlories(totalCalories);
        
        // update local storage
        StorageCtrl.updateItemStorage(updateItem);
        
        UICtrl.clearEditState();
        
        e.preventDefault();
    }
    
    // delete item submit
    const itemDeleteSubmit = function(e){
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // delete from ui
        UICtrl.deleteListItem(currentItem.id);
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCAlories(totalCalories);
        // delete from local stogare
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        UICtrl.clearEditState();
        e.preventDefault();
    }
    
    // clear all items submit
    const clearAllItemsClick = function(){
        // delete all items from data structure
        ItemCtrl.clearAllItems();
        
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to ui
        UICtrl.showTotalCAlories(totalCalories);
        // remove from ui
        UICtrl.removeItems();
        // clear all items from localstorage
        StorageCtrl.clearItemsFromStorage();
        // hide ul
        UICtrl.hideList();

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
    
})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();