const tasks_data = {{ tasks|tojson}}

// if ADD NEW TASK
let task_new = new FormData(document.querySelector("#add_new_task"))
fetch('/', {
    "method": "POST",
    "headers": {"Content-Type": "application/json"},
    "body": JSON.stringify(task_new),
}).then(response => response.json())
    .then(data => {
        ??
    })