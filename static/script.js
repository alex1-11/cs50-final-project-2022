const tasks_data = {{ tasks|tojson}}

// if ADD NEW TASK
getElementById("add_new_task").addEventListener("click", addtask())

function addtask() {
    let task_new = new FormData(document.querySelector("#add_new_task"))
    const tasklist_end_div = getElementById("tasklist_end")
    event.preventDefault()
    fetch('/', {
        "method": "POST",
        "body": task_new,
    }).then(response => response.text)
        .then(text => tasklist_end_div.inserAdjacentHTML("beforebegin", text)
        )
}