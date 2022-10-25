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
        task_div.outerHTML = text
        task_set_triggers(task_div)
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
// const tasks_data = {{ tasks|tojson}};


// May get handy (call func/var from string name) https://www.geeksforgeeks.org/how-to-call-function-from-it-name-stored-in-a-string-using-javascript/