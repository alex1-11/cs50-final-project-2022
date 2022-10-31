// Declare possible actions and define tool to set event listeners to tasks
const actions = [
    'task_delete',
    'task_mark'
]

const tasklist = document.querySelector("#tasklist")
const viewlist = document.querySelector("#viewlist")
const viewlist_btns = viewlist.querySelectorAll("button")
let active_view = tasklist.querySelector("#active_view").value

const form_task_add_new = document.querySelector("#form_task_add_new")


function taskSetTriggers(task_div) {
    for (let act of actions) {
        task_div.querySelector(`.${act}`).addEventListener('click', task_action, false)
    }
}


// Add new task
function task_add_new(event) {
    let tasklist_end_div = document.querySelector("#tasklist_end")
    let task_form_data = new FormData(form_task_add_new)
    task_form_data.append('view', active_view)
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
        // Update current view and change title of page
        active_view = document.querySelector("#active_view").value
        document.title = "tskFLOW: " + active_view
        // Readd event listeners for tasks' functionality
        taskSetTriggersAll()
        // Change active tab style
        viewlist_btns.forEach(btn => {
            btn.classList.remove('active')
            if (btn.value == active_view) {
                btn.classList.add('active')
            }

        })
    }).catch(error => console.error('Error: ', error))
}
viewlist_btns.forEach(btn => btn.addEventListener('click', view_change, false))



// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event


// Inspect divs of every task for match with conditions for specific view-tab
// This will convert js datetime to sql datetime new Date().toISOString().slice(0, 19).replace('T', ' ');

// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

// May get handy (call func/var from string name) https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/