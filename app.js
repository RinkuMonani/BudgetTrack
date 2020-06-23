// BUDGET CONTROLEER
var budgetController = (function(){
    
    var Expense = function(id, desciption, value){
        this.id = id;
        this.desciption = desciption;
        this.value = value;
    }
    
    var Income = function(id, desciption, value){
        this.id = id;
        this.desciption = desciption;
        this.value = value;
    }

    var data = {
        allItems:{
            exp: [],
            inc: []
        },

        total:{
            exp: 0,
            inc: 0
        }
    }

    // return {
    //     addItem: function(type, desciption, value){
    //         var newItem;
    //         var ID = 0;

    //         if(type === 'exp')
    //             newItem = new Expense(ID, desciption, value);
    //         else if(type === 'inc')
    //             newItem = new Income(ID, desciption, value);

    //     }
    // }
    
    

})();


// UI CONTROLLER
var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.add__type',
        desciption: '.add__description',
        value: '.add__value',
        addButton: '.add__btn'
    }
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                desciption: document.querySelector(DOMStrings.desciption).value,
                value: document.querySelector(DOMStrings.value).value
            }
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    }

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setUpEventListners = function(){
        
        var DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
                
        });

    }
    
    var ctrlAddItem = function(){
        // get input data
        var inputs = UIController.getInput();
        console.log(inputs);

        // add item to budget controller

        // add new item to UI

        // calculate the budget

        // Update the UI / display the budget
    }

    return{
        init: function(){ 
            setUpEventListners();
        }
    }

})(budgetController, UIController );

controller.init();

