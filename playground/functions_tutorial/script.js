//RETRIEVE TO DO FROM LOCAL STORAGE OR INITILAIZE AN EMPTY ARRAY


// the  input can be seen and visible and lots of properties that are unused
let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput")
const todoList = document.getElementById("todoList")
const todoCount = document.getElementById("todoCount")

const addButton = document.querySelector(".btn")
const deleteButton = document.querySelector("deleteButton")
console.log(todoInput);


//initialize, is what differs static form dynamixc webpaeg

document.addEventListener("DOMContentLoaded", function() {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("Keydown", function(event) {
        if(event.key==="Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click",deleteAllTasks);
    displayTasks();
});


function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
        todo.push({
            text:newTask,
            disabled:false
        });
        saveToLocalStorage();
        todoInput.value = ""
        displayTasks()
    }
}

function deleteAllTasks() {
    console.log("test");
}
function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item,index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            <div class = "todo-container">
                <input type="checkbox" class="todo-checkbox" 
                id="input-${index}" ${
            item.disabled ? "checked" : ""
        }>
            <p id="todo-${index}" class="${item.disabled ?
            "disabled" :""
        }" onclick="editTask(${index})">${item.text}>
            </p>
            </div>
        `;
        p.querySelector(".todo-checkbox").addEventListener("change", () => {
            toggleTask(index);
        });
        todoList.appendChild(p)
    });
}

function saveToLocalStorage () {
    localStorage.setItem("todo",JSON.stringify(todo));
}


