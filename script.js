var inc = 0, exp = 0;
let transactions = [
    // {
    //     id: 1,
    //     name: 'Freelance',
    //     amount: 270,
    //     type: 'Income'
    // }
];

function loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
}

// Function to save transactions to local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function deleteTransaction(index) {

    transactions = transactions.filter(transaction => transaction.id !== index);
    count = exp = inc = 0;
    saveTransactions();
    renderList(); // Update the UI after deleting the transaction

}



function handleEdit(transaction, index) {
    let transactionItem = transactions[index];

    // Get the current name and amount
    const nameElement = transaction.querySelector('.name');
    const amountElement = transaction.querySelector('.amount');
    const typeElement = transaction.querySelector('.type');

    const name = nameElement.textContent;
    const amount = amountElement.textContent;
    const type = typeElement.textContent;

    // Replace name and amount with input fields
    nameElement.innerHTML = `<input type="text" class="edit-name" value="${name}" />`;
    amountElement.innerHTML = `<input type="number" class="edit-amount" value="${amount}" />`;
    typeElement.innerHTML = `<input type="text" class="edit-type" value="${type}" />`;

    // Focus on the name input field
    const nameInput = transaction.querySelector('.edit-name');
    nameInput.focus();
    // Add event listener to save changes on Enter key press
    transaction.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {

            event.preventDefault();
            // Get the updated name and amount from the input fields
            const newName = nameInput.value;
            const newAmount = transaction.querySelector('.edit-amount').value;
            const newType = transaction.querySelector('.edit-type').value;
            // Update transaction details
            if (newName == '' || isNaN(parseInt(newAmount)) || parseInt(newAmount) <= 0 || (newType != 'Income' && newType != 'Expense')) {
                alert('Please fill all fields or enter data correctly.');
                return;
            }

            transactionItem.name = newName.toUpperCase();
            transactionItem.amount = parseInt(newAmount);
            transactionItem.type = newType;
            // Render the updated transaction list
            count = exp = inc = 0;
            saveTransactions();
            renderList();

            // Disable contentEditable after saving changes
            nameElement.innerHTML = newName;
            amountElement.innerHTML = newAmount;
            typeElement.innerHTML = newType;
        }
    });
}


const list = document.getElementById('items');
const state = document.getElementById('status');
var remainAmount = document.getElementById('totalAmount');
var deficitAmount = document.getElementById('deficitAmount');
var incAmount = document.getElementById('incomeAmount');
var expAmount = document.getElementById('expenseAmount');


function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        state.innerHTML = 'No expenses.'
    }
    else {
        state.innerHTML = '';
        remainAmount.innerHTML = '';
        incAmount.innerHTML = '';
        expAmount.innerHTML = '';
    }

    transactions.forEach(({ name, date, amount, type, id }) => {
        const li = document.createElement('li');
        var Type;


        if (type == 'Income') {
            Type = 'incomeType';
            list.insertBefore(li, list.firstChild);
            inc += amount;

        }

        else {
            Type = 'expenseType';
            list.appendChild(li);
            exp += amount;

        }

        li.innerHTML = `<div class="box1"><div class="name"><h4>${name}</h4></div> <div class="amount"><h4>$ ${amount}</h4></div> <div class="${Type} type"><h4>${type}</h4></div></div> <div class="box2"><div class="editBtn"><button type="submit" class="editButton" data-index="${id}">Edit</div> <div class="delBtn"><button type="submit" class="deleteButton" data-index="${id}">Delete</div></div> `;

        const deleteButton = li.querySelector('.deleteButton');
        deleteButton.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            deleteTransaction(index);
        });

        const editButton = li.querySelector('.editButton');
        editButton.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            // const transaction = transactions[index];
            handleEdit(li, index);
        });


    });

    incAmount.innerHTML = '$ ' + inc;
    expAmount.innerHTML = '$ ' + exp;
    if (inc - exp < 0) {
        deficitAmount.innerHTML = '- $ ' + (-(inc - exp));
        remainAmount.innerHTML = '$ 0';
        deficitAmount.style.color = 'red';
    }
    else {
        deficitAmount.innerHTML = '$ 0';
        deficitAmount.style.color = 'black';
        remainAmount.innerHTML = '$ ' + (inc - exp);
    }
}

// renderList();

document.addEventListener('DOMContentLoaded', function () {
    loadTransactions();
    renderList();
});

function addTransaction() {
    let type = document.getElementById('type').value;
    let money = parseInt(document.getElementById('moneyInput').value);
    let newName = document.getElementById('categoryInput').value;
    count = inc = exp = 0;
    if (type == '' || money <= 0 || isNaN(money) || newName == '') {
        alert('Please fill all fields.');
        return;
    }
    const newTransaction = {
        id: transactions.length,
        name: (newName).toUpperCase(),
        amount: money,
        type: type
    };

    transactions.push(newTransaction);
    saveTransactions();
    renderList();

}