// const tasks_data = {{ tasks|tojson}};

// ADD NEW TASK
const form_add_new_task = document.querySelector("#form_add_new_task")
const tasklist_end_div = document.querySelector("#tasklist_end")

function add_new_task(event) {
    const task_form_data = new FormData(form_add_new_task)
    fetch('/', {
        "method": "POST",
        "body": task_form_data,
    }).then(response => response.text())
    .then(text => tasklist_end_div.insertAdjacentHTML('beforebegin', text))
    .catch(error => {
        console.error('Error:', error)
    })
    event.preventDefault()
    form_add_new_task.reset()
}

form_add_new_task.addEventListener("submit", add_new_task)


// DELETE TASK TO BIN
// TODO: Fix addEventListener, attach it to task_del buttons !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let task_del_buttons = document.querySelectorAll('.option-task_del')

function task_delete(event, element) {
    let data = new FormData()
    data.append(element.name, element.value)
    fetch('/', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => element.outerHTML = text)
    .catch(error => {
        console.error('Error:', error)
    })
}

// Add event listener to every task element
// https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/
task_del_buttons.forEach(element => {
    element.addEventListener('click', (task_delete(event, this)))
})



// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
