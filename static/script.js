// Declare possible actions and define tool to set event listeners to tasks
const actions = [
    'task_delete',
    'task_mark'
]

function task_set_triggers(task_div) {
    for (let act of actions) {
        task_div.querySelector(`.${act}`).addEventListener('click', task_action, false)
    }
}


// Add new task
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


// Action with task (delete to bin, mark complete/undone)
function task_action(event) {
    // Remember the task div (parent area)
    var task_div = document.querySelector(`#task_id_${this.value}`)
    // Create form and store task's data to send to Flask:
    // name (which action to take) and value (task's id)
    let data = new FormData()
    data.append(this.name, this.value)
    // Fetch the form data to Flask
    // Convert response to html text, change task's div, reset triggers
    fetch('/', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => {
        // Save the reference point
        var next_div = task_div.nextElementSibling
        // This will make reference deprecated
        task_div.outerHTML = text
        // Restore reference point and reset triggers on task's buttons
        task_set_triggers(next_div.previousElementSibling)
    }).catch(error => {
        console.error('Error: ', error)
    })
}


// Set event listeners on buttons inside each tasks' div
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
let task_divs = document.querySelectorAll('.task_div')
task_divs.forEach(div => task_set_triggers(div))


// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event


// TODO: Tasklists / views
// const tasks_data = {{ tasks|tojson }}
let views = [
    'today',
    'upcoming',
    'nodate',
    'alltasks',
    'completed',
    'deleted',
]

const tab_btns = document.querySelector('#v-pills-tab').children
const tasks = document.querySelectorAll('.task_div')
function show_(div) {
    task_div.classList.replace("invisible", "visible")
}
function hide_(div) {
    task_div.classList.replace("visible", "invisible")
}

// function update_active_tab() {}
var active_tab_btn = tab_btns.querySelector('.active')
// addEventListener tabs click / change

// Store today's date value
let today = new Date().setHours(0, 0, 0, 0)

// Inspect divs of every task for match with conditions for specific view-tab
switch (active_tab_btn.id) {
    case 'v-pills-today-tab':
        tasks.forEach(div => {
            var task_date = new Date(div.querySelector('.task_date').value).setHours(0, 0, 0, 0)
            if (div.classList.contains('task_active') && task_date == today) {
                show_(div)
            }
            else {
                hide_(div)
            }
        })
        break

    case 'v-pills-upcoming-tab':

    case 'v-pills-nodate-tab':

    case 'v-pills-alltasks-tab':

    case 'v-pills-completed-tab':

    case 'v-pills-deleted-tab':

}


        task_divs.forEach(div => {
        })




    tab => {
    if (tab.ariaSelected) {
        task_divs.forEach(div {
            switch (div.classList.contains("task_active")) {

            }
        )
    }


// TODO: set due date / datetime
// This will convert js datetime to sql datetime new Date().toISOString().slice(0, 19).replace('T', ' ');

// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

// May get handy (call func/var from string name) https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/