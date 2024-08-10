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

    // Get the current date and time
    const now = new Date();
    const dateTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");
    todoDiv.appendChild(checkbox);

    // Create todo item with date and time
    const todoItem = document.createElement("li");
    todoItem.innerHTML = `
        <span class="todo-text">${todoInput.value}</span>
        <span class="todo-time">${dateTime}</span>
    `;
    todoItem.classList.add("todo-item");
    todoDiv.appendChild(todoItem);

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

    saveLocalTodos(todoInput.value, dateTime);
}

function handleTodoAction(e) {
    const item = e.target;
    const todo = item.closest(".todo");
    const todoText = todo.querySelector(".todo-text").innerText;
    const todoItem = todo.querySelector(".todo-item");

    if (item.classList.contains("trash-btn")) {
        todo.classList.add("slide");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if (item.classList.contains("edit-btn")) {
        const newText = prompt("Edit your task:", todoText);
        if (newText && newText.trim() !== "" && newText !== todoText) {
            todo.querySelector(".todo-text").innerText = newText;
            updateLocalTodos(todoText, newText);
            
            // Remove any box around the edited task name
            todo.querySelector(".todo-text").style.border = "none";
            todo.querySelector(".todo-text").style.outline = "none";
        }
    }

    if (item.classList.contains("complete-checkbox")) {
        const now = new Date();
        const completionTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        todo.classList.toggle("completed");

        if (todo.classList.contains("completed")) {
            todo.querySelector(".todo-time").innerText += ` (Completed at: ${completionTime})`;
        } else {
            const timeSpan = todo.querySelector(".todo-time");
            timeSpan.innerText = timeSpan.innerText.split(" (")[0]; // Remove the completion timestamp
        }
        updateLocalTodos(todoText, todo.querySelector(".todo-text").innerText, todo.classList.contains("completed") ? completionTime : "");
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

function saveLocalTodos(todo, dateTime, completionTime = "") {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push({ text: todo, dateTime: dateTime, completionTime: completionTime });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    
    if (!Array.isArray(todos)) {
        todos = [];
    }

    todos.forEach(function(todo) {
        if (typeof todo.text === 'string' && todo.text.trim() !== '') {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");

            // Create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("complete-checkbox");
            todoDiv.appendChild(checkbox);

            // Create and add todo text with date and time
            const todoItem = document.createElement("li");
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <span class="todo-time">${todo.dateTime}${todo.completionTime ? ` (Completed at: ${todo.completionTime})` : ""}</span>
            `;
            todoItem.classList.add("todo-item");
            todoDiv.appendChild(todoItem);

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

            // Mark as completed if applicable
            if (todo.completionTime) {
                todoDiv.classList.add("completed");
            }

            todoList.appendChild(todoDiv);
        }
    });
}

function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoText = todo.querySelector(".todo-text").innerText;
    todos = todos.filter(item => item.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodos(oldText, newText, completionTime = "") {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map(item => item.text === oldText ? { ...item, text: newText, completionTime: completionTime } : item);
    localStorage.setItem("todos", JSON.stringify(todos));
}
