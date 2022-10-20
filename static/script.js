// const tasks_data = {{ tasks|tojson}};

// if ADD NEW TASK

function addtask(event) {
    const form = document.querySelector("#form_add_new_task")
    const task_form_data = new FormData(form)
    const tasklist_end_div = document.getElementById("tasklist_end")
    fetch('/', {
        "method": "POST",
        "body": task_form_data,
    }).then(response => response.text())
    .then(text => tasklist_end_div.insertAdjacentHTML('beforebegin', text))
    .catch((error) => {
        console.error('Error:', error)
    })
    event.preventDefault()
    form.reset()
}

document.querySelector("#add_new_task").addEventListener("submit", addtask)