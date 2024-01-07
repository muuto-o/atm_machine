var uiController = (function () {
    var DOMStrings = {

        // Transfer History section
        transferList : document.querySelector('.transfer-history__list'),

        loginBtn: document.querySelector('.login-btn'),
        loginSection: document.querySelector('.login-section'),

        mainMenuSection: document.querySelector('.main-menu-section'),
        balanceValue: document.querySelector('.balance-value'),
        // Income nodes
        incomeSection: document.querySelector('.income-section'),
        incomeBtn: document.querySelector('.income-btn'),
        incomeValue: document.querySelector('.income__value'),
        incomeConfirmBtn: document.querySelector('.income-btn__confirm'),
        incomeBackBtn: document.querySelector('.income-back-btn'),
        // expense
        expenseBtn: document.querySelector('.expense-btn'),
        expenseSection: document.querySelector('.expense-section'),
        expenseValue: document.querySelector('.expense__value'),
        expenseConfirmBtn: document.querySelector('.expense-btn__confirm'),
        expenseBackBtn: document.querySelector('.expense-back-btn'),

        // 
        historyBtn: document.querySelector('.history-btn'),
        documentBtn: document.querySelector('.document-btn'),
        exitBtn: document.querySelector('.exit-btn')
    }
    var DOMClasses = {
        incomeField: ".income__value",
        expenseField: ".expense__value"
    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    var moneyFormat = function (value, type, takeOperatorBofore) {
        value = value + "";
        var formatedString = "";
        var count = 1;
        for (var i = value.length - 1; i >= 0; i--) {
            formatedString += value[i];
            if (count % 3 === 0) formatedString += ",";
            count++;
        }

        if (formatedString[formatedString.length - 1] === ',')
            formatedString = formatedString.substr(0, formatedString.length - 1);
        formatedString = formatedString.split("").reverse().join("");

        if (value > 0 && takeOperatorBofore) {
            if (type === "inc")
                formatedString = "+" + formatedString;
            else formatedString = "-" + formatedString
        }

        return formatedString + "₮";
    };

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        getIncome: function () {
            income = DOMStrings.incomeValue.value;
            return ( income !== "")? parseInt(income) : income;
        },
        getExpense : function(){
            expense = DOMStrings.expenseValue.value;
            return ( expense !== "")? parseInt(expense) : expense;
        },
        clearFields: function () {
            var fields = document.querySelectorAll(DOMClasses.incomeField + ", " + DOMClasses.expenseField);
            nodeListForEach(fields, function (el, index) {
                el.value = "";
            });
        },
        showBalance: function (value) {
            DOMStrings.balanceValue.textContent = moneyFormat(value, 'inc', false);
        },
        printTransferHistory: function(type, item){
            var html, list;
            list = DOMStrings.transferList;
            html = '<div class="%%TYPE%%-%%ID%% list-flex"><div class="date">%%DATE%%</div><div class="value">%%VALUE%%</div></div>'

            html = html.replace("%%TYPE%%", type);
            html = html.replace("%%ID%%", item.id);
            html = html.replace("%%DATE%%", item.date);
            html = html.replace("%%VALUE%%", item.value);

            list.insertAdjacentHTML("beforeend", html);
        }
    }
})();

var financeController = (function () {

    var Income = function (id, value, date) {
        this.id = id;
        this.value = value;
        this.date = date;
    }

    var Expense = function (id, value, date) {
        this.id = id;
        this.value = value;
        this.date = date;
    }

    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        balance: 0
    }

    var calcBalance = function () {
        data.balance = data.totals.inc - data.totals.exp;
    }

    return {
        seeData: function () {
            return data;
        },
        addItem: function (type, value, date) {
            var item, id;

            id = (data.items[type].length === 0) ? 0 : data.items[type][data.items[type].length - 1].id + 1;

            if (type === "inc")
                item = new Income(id, value, date);
            else item = new Expense(id, value, date);

            data.items[type].push(item);
            data.totals[type] += value;

            return item;
        },
        getBalance: function () {
            calcBalance();
            return data.balance;
        }
    }

})();


var appController = (function (uiController, financeController) {


    var updateBalance = function(){
        var balance = financeController.getBalance();

        uiController.showBalance(balance);
        uiController.clearFields();
    }

    var newIncome = function (DOMStrings) {

        var income = uiController.getIncome();

        console.log(income)
        if(income !== ""){
            var currentDate = new Date().toDateString();
            var item = financeController.addItem('inc', income, currentDate);
            updateBalance();
            uiController.printTransferHistory('inc', item)
            DOMStrings.incomeSection.classList.toggle('hide');
            DOMStrings.mainMenuSection.classList.toggle('hide');
        }
        

    }

    var newExpense = function (DOMStrings) {
        var expense = uiController.getExpense();

        if(expense !== ""){
            var currentDate = new Date().toDateString();
    
            var item = financeController.addItem('exp', expense, currentDate);
    
            updateBalance();
            uiController.printTransferHistory('exp', item)
            DOMStrings.expenseSection.classList.toggle('hide');
            DOMStrings.mainMenuSection.classList.toggle('hide');
        }
    }


    var eventListeners = function () {
        var DOMStrings = uiController.getDOMStrings();

        // Нэвтрэх хэсэг
        // Нэвтрэх товчны үйлдэл 
        DOMStrings.loginBtn.addEventListener('click', function () {
            DOMStrings.loginSection.classList.toggle('hide');
            DOMStrings.mainMenuSection.classList.toggle('hide');
        });

        // Үндсэн хэсэг
        // Үндсэн хэсгээс орлого хийх хэсэг рүү шилжих товчны үйлдэл
        DOMStrings.incomeBtn.addEventListener('click', function () {
            DOMStrings.mainMenuSection.classList.toggle('hide');
            DOMStrings.incomeSection.classList.toggle('hide');
        });

        // Үндсэн хэсгээс зарлага хийх хэсэг рүү шилжих товчны үйлдэл
        DOMStrings.expenseBtn.addEventListener('click', function () {
            DOMStrings.mainMenuSection.classList.toggle('hide');
            DOMStrings.expenseSection.classList.toggle('hide');
        });

        // Үндсэн хэсгээс нэвтрэх хэсэг рүү шилжих товчны үйлдэл
        DOMStrings.exitBtn.addEventListener('click', function () {
            DOMStrings.mainMenuSection.classList.toggle('hide');
            DOMStrings.loginSection.classList.toggle('hide');
        });


        // Орлого хийх хэсэг
        // Орлого хийх товчны үйлдэл
        DOMStrings.incomeConfirmBtn.addEventListener('click', function () {
            newIncome(DOMStrings);
        });

        // Орлого хийх хэсгийн буцах товчны үйлдэл
        DOMStrings.incomeBackBtn.addEventListener('click', function () {
            DOMStrings.incomeSection.classList.toggle('hide');
            DOMStrings.mainMenuSection.classList.toggle('hide');
        });

        // Зарлага хийх хэсэг
        // Зарлага хийх товчны үйлдэл
        DOMStrings.expenseConfirmBtn.addEventListener('click', function () {
            newExpense(DOMStrings);
        });

        // Зарлага хийх хэсгийн буцах товчны үйлдэл
        DOMStrings.expenseBackBtn.addEventListener('click', function () {
            DOMStrings.expenseSection.classList.toggle('hide');
            DOMStrings.mainMenuSection.classList.toggle('hide');
        });
    }

    return {
        init: function () {
            console.log('Программ ажиллаа...');
            eventListeners();
        }
    }
})(uiController, financeController);


appController.init();