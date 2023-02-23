class TodoItem {
  private readonly _creationTimestamp: number;
  private readonly _identifier: string;
  private readonly _description: string;
  constructor(private_description: string, identifier?: string) {
    this._creationTimestamp = new Date().getTime();
    this._description = private_description;
    if (identifier) {
      this._identifier = identifier;
    } else {
      this._identifier = Math.random().toString(36).substr(2, 9);
    }
  }

  get creationTimestamp(): number {
    return this._creationTimestamp;
  }

  get identifier(): string {
    return this._identifier;
  }

  get description(): string {
    return this._description;
  }
}

class TodoList {
  private _todoList: ReadonlyArray<TodoItem> = [];
  constructor(todoList?: TodoItem[]) {
    if (Array.isArray(todoList) && todoList.length) {
      this._todoList = todoList;
    }
  }

  get todoList(): ReadonlyArray<TodoItem> {
    return this._todoList;
  }

  addTodo(todoItem: TodoItem) {
    if (todoItem) {
      this._todoList = this._todoList.concat(todoItem);
    }
  }

  removeTodo(itemId: string) {
    if (itemId) {
      this._todoList = this._todoList.filter(
        (item) => item.identifier !== itemId
      );
    }
  }
}

interface TodoListView {
  render(todoList: ReadonlyArray<TodoItem>): void;
  getInput(): TodoItem;
  // getFilter(): string;
  clearInput(): void;
  filter(): void;
}

class HTMLTodoListView implements TodoListView {
  private readonly todoInput: HTMLInputElement;
  private readonly todoListDiv: HTMLDivElement;
  private readonly todoListFilter: HTMLInputElement;
  constructor() {
    this.todoInput = document.getElementById("todoInput") as HTMLInputElement;
    this.todoListDiv = document.getElementById(
      "todoListContainer"
    ) as HTMLDivElement;
    this.todoListFilter = document.getElementById(
      "todoFilter"
    ) as HTMLInputElement;
  }
  render(todoList: ReadonlyArray<TodoItem>): void {
    console.log("Updating the rendered todo list");
    this.todoListDiv.innerHTML = "";
    this.todoListDiv.textContent = ""; // Edge, ...

    const ul = document.createElement("ul");
    ul.setAttribute("id", "todoList");
    this.todoListDiv.appendChild(ul);

    todoList.forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("class", "todo-list-item");
      li.innerHTML = `<a href='#' onclick='todoIt.removeTodo("${item.identifier}")'>${item.description}`;
      ul.appendChild(li);
    });
  }
  getInput(): TodoItem {
    const todoInputValue: string = this.todoInput.value.trim();
    const retVal: TodoItem = new TodoItem(todoInputValue);
    return retVal;
  }
  // getFilter(): string {}
  clearInput(): void {
    this.todoInput.value = "";
  }

  filter(): void {
    console.log("Filtering the rendered todo list");

    const todoListHtml: HTMLUListElement = document.getElementById(
      "todoList"
    ) as HTMLUListElement;

    if (todoListHtml == null) {
      console.log("Nothing to filter");
      return;
    }

    const todoListFilter = document.getElementById(
      "todoFilter"
    ) as HTMLInputElement;
    const todoListFilterText = todoListFilter.value.toUpperCase();

    todoListHtml.childNodes.forEach((item) => {
      let itemText: string | null = item.textContent;
      if (itemText !== null) {
        itemText = itemText.toUpperCase();

        if (itemText.startsWith(todoListFilterText)) {
          (item as HTMLLIElement).style.display = "list-item";
        } else {
          (item as HTMLLIElement).style.display = "none";
        }
      }
    });
  }
}

interface todoListController {
  addTodo(): void;
  filterTodoList(): void;
  removeTodo(identifier: string): void;
}

class EventUtils {
  static isEnter(event: KeyboardEvent): boolean {
    let isEnterResult = false;
    if (event !== undefined && event.defaultPrevented) {
      return false;
    }

    if (event === undefined) {
      isEnterResult = false;
    } else if (event.key !== undefined) {
      isEnterResult = event.key === "Enter";
    } else if (event.code !== undefined) {
      isEnterResult = event.code === "13";
    }
    return isEnterResult;
  }
}

class TodoIt implements todoListController {
  private readonly _todoList: TodoList = new TodoList();
  constructor(private _todoListView: TodoListView) {}
  addTodo(): void {
    const newTodo = this._todoListView.getInput();

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
  }

  filterTodoList(): void {
    this._todoListView.filter();
  }

  removeTodo(identifier: string): void {
    if (identifier) {
      this._todoList.removeTodo(identifier);
      this._todoListView.render(this._todoList.todoList);
      this.filterTodoList();
    }
  }
}

const view = new HTMLTodoListView();
const todoIt = new TodoIt(view);
