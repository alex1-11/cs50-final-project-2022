
const tasklist = document.querySelector("#tasklist")
const viewlist = document.querySelector("#viewlist")
const viewlist_btns = viewlist.querySelectorAll("button")
let active_view = tasklist.querySelector("#active_view").value
let form_task_add_new = document.querySelector("#form_task_add_new")

// Declare possible actions with task
const actions = [
    'task_delete',
    'task_mark',
]

// Set event linsteners on buttons of task_div
function taskSetTriggers(task_div) {
    for (let act of actions) {
        task_div.querySelector(`.${act}`).addEventListener('click', task_action, false)
    }
    // Right click for edit menu https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
    task_div.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        console.log('RMB pressed')
        task_div.querySelector('button.edit_menu_show').click()
    })
    task_div.querySelector('.edit_menu_show').addEventListener('click', (event) => console.log('edit_menu_show'))
}


// Set event listeners on buttons of each tasks' divs
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
function taskSetTriggersAll() {
    let task_divs = document.querySelectorAll('.task_div')
    task_divs.forEach(div => taskSetTriggers(div))
    form_task_add_new = document.querySelector("#form_task_add_new")
    form_task_add_new.addEventListener('submit', task_add_new, false)
}
taskSetTriggersAll()


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
        // Handle the notasks screen case to update tasklist with new task
        if (document.querySelector('#notasks')) {
            document.querySelector('#notasks').remove()
            document.querySelector('#tasklist_header').classList.remove('invisible')
        }
        // Finally add new task to active list
        tasklist_end_div.insertAdjacentHTML('beforebegin', text)
        // Add event listeners to the fresh task
        const task_div = tasklist_end_div.previousElementSibling
        taskSetTriggers(task_div)
    }).catch(error => {
        console.error('Error: ', error)
    })
    form_task_add_new.reset()
}


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


// Tasklists / views
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
        // And capitalize first letter https://stackoverflow.com/a/33704783/20260711
        active_view = document.querySelector("#active_view").value
        document.title = "tskFLOW: ".concat(
            active_view.charAt(0).toUpperCase(),
            active_view.substring(1)
        )
        // Toggle visibility of #task_add_new block for view of deleted tasks
        if (active_view == 'deleted') {
            document.querySelector('#task_add_new').classList.add('invisible')
        }
        else {
            document.querySelector('#task_add_new').classList.remove('invisible')
        }
        // Re-add event listeners for in-tasks functionality
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








// This will convert js datetime to sql datetime new Date().toISOString().slice(0, 19).replace('T', ' ');

// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

// May get handy (call func/var from string name) https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/