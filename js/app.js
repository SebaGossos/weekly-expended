// VARIABLES AND SELECTORS
const form = document.querySelector("#agregar-gasto")
const expenseList = document.querySelector("#gastos ul")


// EVENTS
eventListener();
function eventListener( e ) {
    document.addEventListener('DOMContentLoaded', askBudget)
    form.addEventListener('submit', addExpenses);
}



// CLASS
class Budget {
    constructor( budget ) {
        this.budget = Number( budget );
        this.remaining = Number( budget );
        this.expenses = [];
    }

    newSpent( spent ) {
        this.expenses = [...this.expenses, spent];
        console.log( this.expenses )
    }
}

class UI {
    budgetInsert( amount ) {
        const { budget, remaining } = amount; 

        // add to HTML
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }

    printAlert( message, type ) {
        //create div
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if( type === 'error' ) {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        }

        // error message
        divMessage.textContent = message;

        // insert HTML
        document.querySelector('.primario').insertBefore(divMessage, form)

        // remove message
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
        
    }
}
// instance
const ui = new UI();
let budget;

// FUNCTIONS
function askBudget() {
    const userBudget = prompt('¿What is your budget?').trim();
    
    if( userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0 ) {
        window.location.reload();
    }
    
    // valid budget
    budget = new Budget( userBudget );
    console.log( budget );

    ui.budgetInsert( budget );
}

function addExpenses( e ) {
    e.preventDefault();

    // read data form
    const name = document.querySelector('#gasto').value?.trim();
    const quantity = Number( document.querySelector('#cantidad').value?.trim() );

    // validate
    if( name === '' || quantity === '' ) {
        ui.printAlert('both fields are required', 'error');
        return;
    } else if( quantity <= 0 || isNaN( quantity ) ) {
        ui.printAlert('Quantity is required', 'error');
        return;
    }

    //Generate an object with spend

    const spent = {
        name,
        quantity,
        id: Date.now()
    };
    budget.newSpent( spent );

    // MESSAGE OF ALL GOOD
    ui.printAlert('expense added correctly')

    // RESET FORM
    form.reset();
}

