const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoAction);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value.trim() === "") return; // Prevent adding empty tasks

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");
    todoDiv.appendChild(checkbox);

    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Add edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    // Add delete button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";

    saveLocalTodos(todoInput.value);
}

function handleTodoAction(e) {
    const item = e.target;
    const todo = item.closest(".todo");
    const todoText = todo.querySelector(".todo-item");

    if (item.classList.contains("trash-btn")) {
        todo.classList.add("slide");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if (item.classList.contains("edit-btn")) {
        const newText = prompt("Edit your task:", todoText.innerText);
        if (newText && newText.trim() !== "" && newText !== todoText.innerText) {
            todoText.innerText = newText;
            updateLocalTodos(todoText.innerText, newText);
            
            // Remove any box around the edited task name
            todoText.style.border = "none";
            todoText.style.outline = "none";
        }
    }

    if (item.classList.contains("complete-checkbox")) {
        todo.classList.toggle("completed");
        updateLocalTodos(todoText.innerText, todoText.innerText); // Just to update the local storage
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "pending":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    if (!Array.isArray(todos)) {
        todos = [];
    }

    todos.forEach(function(todo) {
        if (typeof todo === 'string' && todo.trim() !== '') {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");

            // Create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("complete-checkbox");
            todoDiv.appendChild(checkbox);

            // Create and add todo text
            const newTodo = document.createElement("li");
            newTodo.innerText = todo;
            newTodo.classList.add("todo-item");
            todoDiv.appendChild(newTodo);

            // Add edit button
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.classList.add("edit-btn");
            todoDiv.appendChild(editButton);

            // Add delete button
            const trashButton = document.createElement("button");
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            trashButton.classList.add("trash-btn");
            todoDiv.appendChild(trashButton);

            todoList.appendChild(todoDiv);
        }
    });
}

function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoText = todo.querySelector(".todo-item").innerText;
    todos = todos.filter(item => item !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodos(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const index = todos.indexOf(oldText);
    if (index > -1) {
        todos[index] = newText;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}
