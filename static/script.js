// const tasks_data = {{ tasks|tojson}};

// if ADD NEW TASK

function addtask(event) {
    const task_new = new FormData(document.querySelector("#add_new_task"));
    const tasklist_end_div = document.getElementById("tasklist_end");
    fetch('/', {
        "method": "POST",
        "body": task_new,
    }).then(response => response.text)
    .then(text => tasklist_end_div.insertAdjacentHTML("beforebegin", text))
    .catch((error) => {
        console.error('Error:', error);
      });
    event.preventDefault();
};

document.querySelector("#add_new_task").addEventListener("submit", addtask);