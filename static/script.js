// const tasks_data = {{ tasks|tojson}};

// Add event listeners and refresh them?
function addEvListeners(element, action) {
    if (action == 'task_delete') {
        element.addEventListener('click', task_delete, false)
    }
    else if (action == 'task_add_new') {
        element.addEventListener('submit', task_add_new, false)
    }


// TODO FIX: add event listeners to freshly created tasks!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!


// ADD NEW TASK
const form_task_add_new = document.querySelector("#form_task_add_new")
const tasklist_end_div = document.querySelector("#tasklist_end")

function task_add_new(event) {
    const task_form_data = new FormData(form_task_add_new)
    event.preventDefault()
    fetch('/', {
        "method": "POST",
        "body": task_form_data,
    }).then(response => response.text())
    .then(text => tasklist_end_div.insertAdjacentHTML('beforebegin', text))
    .catch(error => {
        console.error('Error:', error)
    })
    form_task_add_new.reset()
}

form_task_add_new.addEventListener("submit", task_add_new)


// DELETE TASK TO BIN
const task_del_buttons = document.querySelectorAll('.option-task_del')

function task_delete(event) {
    // Remember the parent div to change
    const task_div = document.querySelector(`#task_id_${this.value}`)
    // Create form and store task's data
    // (name and value of html-element to send to Flask)
    let data = new FormData()
    data.append(this.name, this.value)
    // Fetch the form data to Flask, convert response to html text
    // and change whole task's div
    fetch('/', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => task_div.outerHTML = text)
    .catch(error => {
        console.error('Error:', error)
    })
    document.querySelector(`#task_del_button_${this.value}`)
    .addEventListener('click', task_delete, false)
}

// Add event listener to every task element
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
task_del_buttons.forEach(element => {
    element.addEventListener('click', task_delete, false)
})



// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
