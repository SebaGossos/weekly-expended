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
        this.calculateRemaining();
    }

    calculateRemaining() {
        const spent = this.expenses.reduce( ( total, bill ) => total + bill.quantity, 0 );
        this.remaining = this.budget - spent;
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

    addBudgetList( bills ) {

        // Clean HTML;
        this.cleanHTML();
        
        // Iterate
        bills.forEach( bill => {
            
            const { quantity, name, id } = bill;

            // add an LI
            const newBill = document.createElement("li");
            newBill.className = 'list-group-item d-flex justify-content-between align-items-center';
            newBill.dataset.id = id;

            // add HTML with bills
            newBill.innerHTML = `
                ${ name } <span class="badge badge-primary badge-pill">$ ${ quantity }</span>
            `;

            // boton to delet bill
            const btnDelet = document.createElement('button');
            btnDelet.classList.add('btn','btn-danger', 'borrar-gasto')
            btnDelet.innerHTML = 'Borrar &times'

            newBill.appendChild( btnDelet );

            // add to HTLM
            expenseList.appendChild( newBill );
            
        });
    }

    cleanHTML() {
        while( expenseList.firstChild ) {
            expenseList.removeChild( expenseList.firstChild )
        }
    }

    updateRemaining( remaining ) {
        document.querySelector('#restante').textContent = remaining;
    }

    checkBudget( remainingObj ) {
        const { budget, remaining } = remainingObj;

        const remainingDiv = document.querySelector('.restante');

        // Check 25%
        if( ( budget / 4 ) >= remaining ) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if (( budget / 2 ) >= remaining ) {
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        }

        // if Total is 0 or less
        if( remaining <= 0 ) {
            ui.printAlert('El presupuesto se ah agotado', 'error' );

            form.querySelector('button[type="submit"]').disabled = true;
        }
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

    // Print budgets
    const { expenses, remaining } = budget;
    ui.addBudgetList( expenses );

    ui.updateRemaining( remaining );

    ui.checkBudget( budget );

    // RESET FORM
    form.reset();
}

