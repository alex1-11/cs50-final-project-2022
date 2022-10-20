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
    .catch((error) => {
        console.error('Error:', error)
    })
    event.preventDefault()
    form_add_new_task.reset()
}

form_add_new_task.addEventListener("submit", add_new_task)


// DELETE TASK TO BIN
function task_delete(event) {
    const delete_trigger_div



    // outerHTML
}