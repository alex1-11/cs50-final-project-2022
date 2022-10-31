// Declare possible actions and define tool to set event listeners to tasks
const actions = [
    'task_delete',
    'task_mark'
]

function taskSetTriggers(task_div) {
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
        taskSetTriggers(task_div)
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
        taskSetTriggers(next_div.previousElementSibling)
    }).catch(error => {
        console.error('Error: ', error)
    })
}


// Set event listeners on buttons inside each tasks' div
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
function taskSetTriggersAll() {
    let task_divs = document.querySelectorAll('.task_div')
    task_divs.forEach(div => taskSetTriggers(div))
}
taskSetTriggersAll()



// TODO: Tasklists / views
// var view = {{ view|tojson }}
const tasklist = document.querySelector("#tasklist")
const viewlist = document.querySelector("#viewlist")
const viewlist_btns = viewlist.querySelectorAll("button")

function view_change(event) {
    // Get type of view triggered and pack it for fetch to Flask
    let data = new FormData()
    data.append(this.name, this.value)
    fetch('/view', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => {
        tasklist.innerHTML = text
        taskSetTriggersAll()
        // TODO: Differrent new task add parameters depending on type of view
        active_view = tasklist.querySelector("#active_view").value
        // TODO: Change title of page
        document.title = active_view

    })
}




// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event


// Inspect divs of every task for match with conditions for specific view-tab
// This will convert js datetime to sql datetime new Date().toISOString().slice(0, 19).replace('T', ' ');

// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

// May get handy (call func/var from string name) https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/