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
        },

        budget: 0,

        percentage: -1
    }

    var calculateTotal = function(type){
        var total  = 0;

        data.allItems[type].forEach(function(curr){
            total += curr.value;
        });

        data.total[type] = total;
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

        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpenses: data.total.exp,
                percentage: data.percentage
            }
        },

        calculateBudget: function(){
            var percentage;

            // calculate total income and expenses
            calculateTotal("inc");
            calculateTotal("exp");

            // calculate budget : income - expense
            data.budget = data.total["inc"] - data.total["exp"];

            console.log("Budget : "+data.budget); 

            // calculate percentage to budget
            if(data.total.inc > 0 )
                data.percentage = Math.round((data.total["exp"] / data.total["inc"]) * 100);

            console.log("Expense percentage : "+data.percentage+" % ");
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
                value: parseFloat(document.querySelector(DOMStrings.value).value)
            }
        },

        
        clearFeilds: function(){
            var feilds, feildsArray;
            
            // returns a list
            feilds = document.querySelectorAll(DOMStrings.desciption + ', ' +  DOMStrings.value);
            
            //converting a list to array
            feildsArray = Array.prototype.slice.call(feilds);

            feildsArray.forEach(function(current, index, array){
                current.value = "";
            });

            // setting focus
            feildsArray[0].focus();
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
    
    var updateBudget = function(){
        var budget;

        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. returns the budget
        budget = budgetCtrl.getBudget();

        // 3. Update the UI / display the budget
    }

    var ctrlAddItem = function(){
        var inputs, newItem;

        // 1. get input data
        inputs = UIController.getInput();

        if(inputs.desciption === "" || isNaN(inputs.value) || inputs.value < 1){
        
            alert("Enter valid value in the feilds");
        
        }else{

            // 2. add item to budget controller
            newItem = budgetCtrl.addItem(inputs.type, inputs.desciption, inputs.value);
            
            // 3. add new item to UI
            UICtrl.addListItem(newItem, inputs.type);

            // 4. clear the feilds
            UICtrl.clearFeilds();

            // 5. Calculate and Update Budget
            updateBudget();
        
        }
       
    }

    return{
        init: function(){ 
            setUpEventListners();
        }
    }

})(budgetController, UIController );

controller.init();

