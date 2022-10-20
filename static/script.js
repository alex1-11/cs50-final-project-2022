// const tasks_data = {{ tasks|tojson}};

// if ADD NEW TASK

function addtask(event) {
    let task_new = new FormData(document.querySelector("#add_new_task"));
    const tasklist_end_div = getElementById("tasklist_end");
    fetch('/', {
        "method": "POST",
        "body": task_new,
    }).then(response => response.text)
    .then(text => tasklist_end_div.inserAdjacentHTML("beforebegin", text))
    event.preventDefault();
};

document.querySelector("#task_new_trigger").addEventListener("submit", addtask);