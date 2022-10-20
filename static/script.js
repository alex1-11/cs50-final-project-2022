// const tasks_data = {{ tasks|tojson}};

// if ADD NEW TASK

function addtask(event) {
    const task_new = new FormData(document.querySelector("#add_new_task"));
    const tasklist_end_div = document.getElementById("tasklist_end");
    fetch('/', {
        "method": "POST",
        "body": task_new,
    }).then((response) => response.text)
    .then((text) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "/");
    })
    .then((html) => tasklist_end_div.insertAdjacentHTML("beforebegin", html))
    .catch((error) => {
        console.error('Error:', error);
    });
    event.preventDefault();
};

document.querySelector("#add_new_task").addEventListener("submit", addtask);