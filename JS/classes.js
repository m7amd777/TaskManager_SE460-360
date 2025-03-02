class Task {
    #taskID;
    #taskName;
    #description;
    #dueDate;
    #priority;
    #category;
    #status;

    constructor(taskID, taskName, description, dueDate, priority, category, status) {
        this.#taskID = taskID;
        this.#taskName = taskName;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#category = category;
        this.#status = status;
    }

    getTaskName() {}
    setTaskName(name) {}
    getDescription() {}
    setDescription(desc) {}
    getDueDate() {}
    setDueDate(date) {}
    getPriority() {}
    setPriority(priority) {}
    getStatus() {}
    setStatus(status) {}
    createTask() {}
    editTask() {}
    deleteTask() {}
    markCompleted() {}
    assignDueDate(date) {}
}

class Tasklist {
    #tasks;

    constructor() {
        this.#tasks = [];
    }

    getTasks() {}
    addTask(task) {}
    removeTask(taskID) {}
    viewTasks() {}
    selectTask() {}
    filterTasks(criteria) {}
    sortTasks(order) {}
    searchTask() {}
}

class User {
    #userID;
    #name;
    #email;
    #password;

    constructor(userID, name, email, password) {
        this.#userID = userID;
        this.#name = name;
        this.#email = email;
        this.#password = password;
    }

    getName() {}
    setName(name) {}
    getEmail() {}
    setEmail(email) {}
    setPassword(password) {}
    login() {}
    register() {}
    resetPassword() {}
}
