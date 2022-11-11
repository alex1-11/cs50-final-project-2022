const tasklist = document.querySelector("#tasklist")
const viewlist = document.querySelector("#viewlist")
const viewlist_btns = viewlist.querySelectorAll("button")
let active_view = tasklist.querySelector("#active_view").value
let task_divs = document.querySelectorAll('.task_div')
let form_task_add_new = document.querySelector("#form_task_add_new")
let view_refresh = document.querySelector('.view-refresh')


// Declare possible actions with task (all of them match buttons' classes)
const actions = [
    'task_delete',
    'task_mark',
    'task_title_edit_toggle',
    'task_title_edit_form',
    'task_date_edit_toggle',
    'task_date_edit_form',
]

// Set event linsteners on buttons of task_div
function taskSetTriggers(task_div) {
    // Goes through all the different buttons and forms
    for (let act of actions) {
        if (act.includes('form')) {
            task_div.querySelector(`.${act}`).addEventListener('submit', taskAction, false)
        } else if (act.includes('toggle')) {
            task_div.querySelectorAll(`.${act}`).forEach(
                toggle => toggle.addEventListener('click', taskTitleEditToggle)
            )
        } else {
            task_div.querySelector(`.${act}`).addEventListener('click', taskAction, false)
        }
    }
    // Right click for edit menu https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
    task_div.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        task_div.querySelector('button.edit_menu_show').click()
    })
}


// Set event listeners on buttons of each tasks' divs
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
function taskSetTriggersAll() {
    // Refresh var-element reference
    task_divs = document.querySelectorAll('.task_div')
    form_task_add_new = document.querySelector("#form_task_add_new")
    view_refresh = document.querySelector('.view-refresh')
    // Add event listeners
    task_divs.forEach(div => taskSetTriggers(div))
    form_task_add_new.addEventListener('submit', taskAddNew, false)
    view_refresh.addEventListener('click', viewRefresh)
}
taskSetTriggersAll()


// Add new task
function taskAddNew(event) {
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
            // Refresh view
            viewlist.querySelector('button.active').click()
        }).catch(error => {
            console.error('Error: ', error)
        })
    form_task_add_new.reset()
}


// Action with task (delete to bin, mark complete/undone)
function taskAction(event) {
    // Distinguish input command, remember the task div (parent area)
    let task_div
    let data
    if (this.name.includes('form')) {
        task_div = this.parentElement
        // Load form data and store it to send to Flask:
        data = new FormData(this)
        event.preventDefault()
    } else {
        task_div = document.querySelector(`#task_id_${this.value}`)
        // Create form and pass task's id to it, to send this data to Flask
        data = new FormData()
        // Which action to take goes in `name`, `value` stores task's id
        data.append(this.name, this.value)
    }
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
function viewChange(event) {
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
                document.querySelector('#task_add_new').classList.add('d-none')
            } else {
                document.querySelector('#task_add_new').classList.remove('d-none')
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
viewlist_btns.forEach(btn => btn.addEventListener('click', viewChange, false))


function viewRefresh() {
    viewlist.querySelector('button.active').click()
}


// Show form to change task's title
function taskTitleEditToggle() {

    var task_div = document.querySelector(`#task_id_${this.value}`)
    task_div.querySelector(`.task_current_${this.name}`).classList.toggle('d-none')
    task_div.querySelector(`.task_div_edit_${this.name}`).classList.toggle('d-none')
}
