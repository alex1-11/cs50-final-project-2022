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

// TODO: check where script.js goes for 'onclick' (must before)
// DELETE TASK TO BIN
function task_delete(this) {
    const target_div = document.querySelector(`#del_task_id_${this.value}`)
    let data = new FormData()
    data.append(this.name: this.value)
    fetch('/', {
        "method": "POST",
        "body": data,
    }).then(response => response.text())
    .then(text => target_div.outerHTML = text)
    .catch(arror => {
        console.error('Error:', error)
    })
}

// TODO: right click menu
// https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
