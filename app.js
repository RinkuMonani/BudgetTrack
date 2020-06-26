// BUDGET CONTROLEER
var budgetController = (function(){
    
    var Expense = function(id, desciption, value){
        this.id = id;
        this.desciption = desciption;
        this.value = value;
        this.percentage = -1;
    }
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        }else{
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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

        
        deleteItemFromDS: function(type, id){
            var targetIndex;

            data.allItems[type].forEach(function(curent, index, array){
                if(curent.id === id){
                    data.allItems[type].splice(index, 1);
                }
            });

            // var ids, index;

            // var ids = data.allItems[type].map(function(current, index, array){
            //     return current.id;
            // });

            // index = ids.indexOf(parseInt(id));

            // if(index > -1){
            //     data.allItems[type].splice(index, 1);
            // }

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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.total.inc);
            });
        },

        getPercentages: function(){
            var percentages = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });          

            return percentages;
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber =  function(number, type){
        // + or - before the number
        // coma separtion
        // exactly 2 decimal points
        var numSplit, intPart, decPart, sign, index = [];

        number = Math.abs(number);
        number = number.toFixed(2); // method of 'NUMBER' object

        numSplit = number.split('.');
        intPart = numSplit[0];
        decPart = numSplit[1];

        for(var i = 3; i < intPart.length; i+=3){
            intPart = intPart.substr(0, intPart.length - i) + ',' +intPart.substr(intPart.length-i, i);
            console.log(intPart);
        }
    
        type === 'exp' ? sign = '-' : sign = '+';

        return sign + ' ' + intPart + '.' + decPart;
    }

    var nodeListForEach = function(list, callBack){
        for(var i=0; i<list.length; ++i){
            callBack(list[i], i);
        }
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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%DESCRIPTION%</div> <div class="right clearfix"> <div class="item__value">%VALUE%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="material-icons">cancel</i></button> </div> </div> </div>';
            }
            else if(type === 'exp'){        
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%DESCRIPTION%</div> <div class="right clearfix"> <div class="item__value">%VALUE%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="material-icons">cancel</i></button> </div> </div> </div>';
            }
            
            // replace the place holder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%DESCRIPTION%', obj.desciption);
            newHtml = newHtml.replace('%VALUE%', formatNumber(obj.value, type));


            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteItemFromUI: function(selectorID){
            var parent;

            parent = document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
        },

        displayPercentages: function(percentages){
            var feilds;

            feilds = document.querySelectorAll(DOMStrings.expensePercentageLabel);
            
            nodeListForEach(feilds, function(current, index){
                if(percentages[index] > 0)
                    current.textContent = percentages[index] + "%";
                else
                current.textContent = '--';
            });
        },

        displayBudget: function(obj){
            
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;

            if(obj.budget > 0){
                document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, 'inc');
            }else{
                document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, 'exp');
            }
            
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
        
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
            

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + ' % ';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
            
        },

        displayDate: function(){
            var now, year, month;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] +' '+year;
        },

        changeOutline: function(){
            var feilds;
            
            feilds = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.desciption + ',' +
                DOMStrings.value
            )

            nodeListForEach(feilds, function(current){
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.addButton).classList.toggle('red');
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

        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOMStrings.inputType).addEventListener('change', UICtrl.changeOutline);

    }
    
    var updateBudget = function(){
        var budget;

        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. returns the budget
        budget = budgetCtrl.getBudget();

        // 3. Update the UI / display the budget
        UICtrl.displayBudget(budget);
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

            // 6. calculate and update the percentages
            updatePercentages();
        
        }
       
    }

    var ctrlDeleteItem = function(event){
        var itemID, splitItemID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitItemID= itemID.split('-');
            type = splitItemID[0];
            id = parseInt(splitItemID[1]);
        }

        // 1. Delete the item from the DS
        budgetCtrl.deleteItemFromDS(type, id);

        // 2. Delete the item from the UI
        UICtrl.deleteItemFromUI(itemID);

        // 3. Update the budget
        updateBudget();

        // 4. calculate and update the percentages
        updatePercentages();
    }

    var updatePercentages = function(){
        var percentages;

        // 1. calculate the percentage
        budgetCtrl.calculatePercentages();

        // 2. read percentages from BudgetCtrl
        percentages = budgetCtrl.getPercentages();
        // console.log(percentages);

        // 3. update the UI
        UICtrl.displayPercentages(percentages);
    }

    return{
        init: function(){ 
            UIController.displayDate();
            setUpEventListners();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: '--'
            });
            
        }
    }

})(budgetController, UIController );

controller.init();

