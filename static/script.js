// const tasks_data = {{ tasks|tojson}};

// Declare possible actions and define tool to set event listeners to tasks
const actions = [
    'task_delete',
    'task_mark'
]

function task_set_triggers(task_div) {
    for (let act of actions) {
        task_div.querySelector(`.${act}`)
        .addEventListener('click', window[act], false)
    }
}


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
    .then(text => {
        tasklist_end_div.insertAdjacentHTML('beforebegin', text)
        // Add event listeners to the fresh task
        const task_div = tasklist_end_div.previousElementSibling
        task_set_triggers(task_div)
    }).catch(error => {
        console.error('Error: ', error)
    })
    form_task_add_new.reset()
}
form_task_add_new.addEventListener('submit', task_add_new, false)



// DELETE TASK TO BIN
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
        console.error('Error: ', error)
    })
    document.querySelector(`#task_del_button_${this.value}`)
    .addEventListener('click', task_delete, false)
}



// TODO: Mark task complete/undone
function task_mark(event) {
    const task_div = document.querySelector(`#task_id_${this.value}`)
    // Pack task's credentials to send to back end
    let data = new FormData()
    data.append(this.name, this.value)
    fetch('/', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => task_div.outerHTML = text)
    .catch(error => {
        console.error('Error: ', error)
    })
    set_event_listener(this, 'task_mark')
}


// Set event listeners tasks' buttons
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
let task_divs = document.querySelectorAll('.task_div')
task_divs.forEach(div => task_set_triggers(div))


// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
