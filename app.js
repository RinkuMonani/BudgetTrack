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


    return {
        addItem: function(type, desc, val){
            var newItem;

            // create new ID
            if(data.allItems[type].length == 0)
                ID = 0;
            else
                ID = data.allItems[type][data.allItems[type].length-1].id + 1

            if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }
            else if(type === 'inc'){
                newItem = new Income(ID, desc, val);
            }
            
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }
})();


// UI CONTROLLER
var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.add__type',
        desciption: '.add__description',
        value: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                desciption: document.querySelector(DOMStrings.desciption).value,
                value: document.querySelector(DOMStrings.value).value
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            // create html string with placeholder text

            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%DESCRIPTION%</div> <div class="right clearfix"> <div class="item__value">%VALUE%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="material-icons">cancel</i></button> </div> </div> </div>';
            }
            else if(type === 'exp'){        
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%DESCRIPTION%</div> <div class="right clearfix"> <div class="item__value">%VALUE%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="material-icons">cancel</i></button> </div> </div> </div>';
            }
            
            // replace the place holder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%DESCRIPTION%', obj.desciption);
            newHtml = newHtml.replace('%VALUE%', obj.value);


            // insert html into DOM
            console.log("\neleent : "+element);
            console.log(newHtml);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
        var inputs, newItem;

        // get input data
        inputs = UIController.getInput();

        // add item to budget controller
        newItem = budgetCtrl.addItem(inputs.type, inputs.desciption, inputs.value);
        
        // add new item to UI
        UICtrl.addListItem(newItem, inputs.type);
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

