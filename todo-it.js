"use strict";
var TodoItem = /** @class */ (function () {
    function TodoItem(private_description, identifier) {
        this._creationTimestamp = new Date().getTime();
        this._description = private_description;
        if (identifier) {
            this._identifier = identifier;
        }
        else {
            this._identifier = Math.random().toString(36).substr(2, 9);
        }
    }
    Object.defineProperty(TodoItem.prototype, "creationTimestamp", {
        get: function () {
            return this._creationTimestamp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TodoItem.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TodoItem.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    return TodoItem;
}());
var TodoList = /** @class */ (function () {
    function TodoList(todoList) {
        this._todoList = [];
        if (Array.isArray(todoList) && todoList.length) {
            this._todoList = todoList;
        }
    }
    Object.defineProperty(TodoList.prototype, "todoList", {
        get: function () {
            return this._todoList;
        },
        enumerable: true,
        configurable: true
    });
    TodoList.prototype.addTodo = function (todoItem) {
        if (todoItem) {
            this._todoList = this._todoList.concat(todoItem);
        }
    };
    TodoList.prototype.removeTodo = function (itemId) {
        if (itemId) {
            this._todoList = this._todoList.filter(function (item) { return item.identifier !== itemId; });
        }
    };
    return TodoList;
}());
var HTMLTodoListView = /** @class */ (function () {
    function HTMLTodoListView() {
        this.todoInput = document.getElementById("todoInput");
        this.todoListDiv = document.getElementById("todoListContainer");
        this.todoListFilter = document.getElementById("todoFilter");
    }
    HTMLTodoListView.prototype.render = function (todoList) {
        console.log("Updating the rendered todo list");
        this.todoListDiv.innerHTML = "";
        this.todoListDiv.textContent = ""; // Edge, ...
        var ul = document.createElement("ul");
        ul.setAttribute("id", "todoList");
        this.todoListDiv.appendChild(ul);
        todoList.forEach(function (item) {
            var li = document.createElement("li");
            li.setAttribute("class", "todo-list-item");
            li.innerHTML = "<a href='#' onclick='todoIt.removeTodo(\"" + item.identifier + "\")'>" + item.description;
            ul.appendChild(li);
        });
    };
    HTMLTodoListView.prototype.getInput = function () {
        var todoInputValue = this.todoInput.value.trim();
        var retVal = new TodoItem(todoInputValue);
        return retVal;
    };
    // getFilter(): string {}
    HTMLTodoListView.prototype.clearInput = function () {
        this.todoInput.value = "";
    };
    HTMLTodoListView.prototype.filter = function () {
        console.log("Filtering the rendered todo list");
        var todoListHtml = document.getElementById("todoList");
        if (todoListHtml == null) {
            console.log("Nothing to filter");
            return;
        }
        var todoListFilter = document.getElementById("todoFilter");
        var todoListFilterText = todoListFilter.value.toUpperCase();
        todoListHtml.childNodes.forEach(function (item) {
            var itemText = item.textContent;
            if (itemText !== null) {
                itemText = itemText.toUpperCase();
                if (itemText.startsWith(todoListFilterText)) {
                    item.style.display = "list-item";
                }
                else {
                    item.style.display = "none";
                }
            }
        });
    };
    return HTMLTodoListView;
}());
var EventUtils = /** @class */ (function () {
    function EventUtils() {
    }
    EventUtils.isEnter = function (event) {
        var isEnterResult = false;
        if (event !== undefined && event.defaultPrevented) {
            return false;
        }
        if (event === undefined) {
            isEnterResult = false;
        }
        else if (event.key !== undefined) {
            isEnterResult = event.key === "Enter";
        }
        else if (event.code !== undefined) {
            isEnterResult = event.code === "13";
        }
        return isEnterResult;
    };
    return EventUtils;
}());
var TodoIt = /** @class */ (function () {
    function TodoIt(_todoListView) {
        this._todoListView = _todoListView;
        this._todoList = new TodoList();
    }
    TodoIt.prototype.addTodo = function () {
        var newTodo = this._todoListView.getInput();
        // verify that there is something to add
        if ("" !== newTodo.description) {
            console.log("Adding todo: ", newTodo);
            // add the new item to the list
            this._todoList.addTodo(newTodo);
            console.log("New todo list: ", newTodo);
            // clear the input
            this._todoListView.clearInput();
            // update the todo list
            this._todoListView.render(this._todoList.todoList);
            // apply the todo list filter
            this.filterTodoList();
        }
    };
    TodoIt.prototype.filterTodoList = function () {
        this._todoListView.filter();
    };
    TodoIt.prototype.removeTodo = function (identifier) {
        if (identifier) {
            this._todoList.removeTodo(identifier);
            this._todoListView.render(this._todoList.todoList);
            this.filterTodoList();
        }
    };
    return TodoIt;
}());
var view = new HTMLTodoListView();
var todoIt = new TodoIt(view);
//# sourceMappingURL=todo-it.js.map