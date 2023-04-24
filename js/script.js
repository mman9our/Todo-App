let tasks = [];
let deletedTasks = 0;

// Retrieves tasks from local storage and assigns them to a variable named "tasks".
// If there are no tasks stored in local storage, an empty array is assigned to the "tasks" variable.
function getTasksFromStorage() {
    try {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        tasks = storedTasks ?? [];
    } catch (error) {
        console.error("Error retrieving tasks from storage:", error);
        tasks = [];
    }
}

getTasksFromStorage();

// Get the DOM element that will contain the tasks
const tasksContainer = document.getElementById("tasks");

// HTML for displaying an image and message when there are no tasks
const emptyTasksContainer = `
    <div class="empty-image">
        <img class="blimp-img" src="images/Empty-Tasks-image.svg" alt="">
        <h4 class="blimp-text">You do not have any tasks, <span class="user-span"> </span>. have a great time! ❤️ </h4>
    </div>
`;

// Get tasks from an array and display them on the screen
function fillTaskOnPage() {
    tasksContainer.innerHTML = "";
    // let index = 0;
    let completedTasks = 0;
    let uncompletedTasks = 0;

    // If there are no tasks, display a message
    if (tasks.length === 0) {
        tasksContainer.innerHTML = emptyTasksContainer;
        return;
    }

    // Loop over each task object in the tasks array
    for (const task of tasks) {

        // Create a new div element to represent the task
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        // If the task is marked as done, add "done" class to the task div.
        if (task.isDone) {
            taskDiv.classList.add("done");
        }

        // Create a new div to hold the task information
        const taskInfoDiv = document.createElement("div");
        taskInfoDiv.classList.add("task-info");

        // Create a h2 element with the task title
        const taskTitle = document.createElement("h2");
        taskTitle.textContent = task.title;
        taskTitle.classList.add("task-title");

        // Append the task title element as a child of the task info div
        taskInfoDiv.appendChild(taskTitle);

        // Create a div to hold the task assignee information
        const taskAssignDiv = document.createElement("div");
        const taskAssignIcon = document.createElement("span");
        taskAssignIcon.classList.add("material-symbols-sharp");
        taskAssignIcon.textContent = "person";
        const taskAssignText = document.createElement("span");
        taskAssignText.textContent = task.assign;
        taskAssignDiv.appendChild(taskAssignIcon);
        taskAssignDiv.appendChild(taskAssignText);
        taskInfoDiv.appendChild(taskAssignDiv);

        // Create a div to hold the task due date information
        const taskDateDiv = document.createElement("div");
        const taskDateIcon = document.createElement("span");
        taskDateIcon.classList.add("material-symbols-sharp");
        taskDateIcon.textContent = "calendar_month";
        const taskDateText = document.createElement("span");
        taskDateText.textContent = task.date;
        taskDateDiv.appendChild(taskDateIcon);
        taskDateDiv.appendChild(taskDateText);
        taskInfoDiv.appendChild(taskDateDiv);

        // Append the task info div as a child of the task div
        taskDiv.appendChild(taskInfoDiv);


        // Create a container div for the task actions
        const taskActionsDiv = document.createElement("div");
        taskActionsDiv.classList.add("task-actions");

        // Create a delete button and add classes and event listener to it
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("circular", "btn-delete");
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        deleteButton.removeEventListener('click', onDeleteButtonClick);

        function onDeleteButtonClick(event) {
            // Get the ID of the associated task
            const taskId = event.target.dataset.taskId;

            // Call the deleteTask function with the task ID as an argument
            deleteTask(taskId);


        }

        // Create a delete icon using a span element with classes added to it
        const deleteIcon = document.createElement("span");
        deleteIcon.classList.add("material-symbols-sharp", "btn-delete-icon");
        deleteIcon.textContent = "delete";

        // Append the delete icon to the delete button
        deleteButton.appendChild(deleteIcon);

        // Append the delete button to the task actions div
        taskActionsDiv.appendChild(deleteButton);


        if (task.isDone) {
            // create a button to unmark the task as done
            const closeButton = document.createElement("button");
            closeButton.classList.add("circular", "btn-done");
            // add event listener to the close button
            closeButton.addEventListener("click", () => {
                toggleTaskCompletion(task.id);
            });
            // create a close icon and append it to the close button
            const closeIcon = document.createElement("span");
            closeIcon.classList.add("material-symbols-sharp", "btn-done-icon");
            closeIcon.textContent = "close";
            closeButton.appendChild(closeIcon);
            // append the close button to the task actions div
            taskActionsDiv.appendChild(closeButton);
        } else {
            // create a button to mark the task as done
            const doneButton = document.createElement("button");
            doneButton.classList.add("circular", "btn-isDone");
            // add event listener to the done button
            doneButton.addEventListener("click", () => {
                toggleTaskCompletion(task.id);
            });
            // create a done icon and append it to the done button
            const doneIcon = document.createElement("span");
            doneIcon.classList.add("material-symbols-sharp", "btn-isDone-icon");
            doneIcon.textContent = "done";
            doneButton.appendChild(doneIcon);
            // append the done button to the task actions div
            taskActionsDiv.appendChild(doneButton);
        }

        // append the task actions div to the task div
        taskDiv.appendChild(taskActionsDiv);
        // append the task div to the tasks container
        tasksContainer.appendChild(taskDiv);


        // Update task counters
        if (task.isDone) {
            completedTasks++;
        } else {
            uncompletedTasks++;
        }

        // Update the task counter display
        updateTaskCounter("number-complete-task", completedTasks);
        updateTaskCounter("number-current-task", uncompletedTasks);
        updateTaskCounter("number-all-task", tasks.length);
        updateDeletedTasksCounter("number-deleted-task", deletedTasks);
    }


    // function to update a task counter display
    function updateTaskCounter(counterId, count) {
        document.getElementById(counterId).textContent = count;
    }

    // function to update the deleted tasks counter display
    function updateDeletedTasksCounter(counterId, count) {
        document.getElementById(counterId).textContent = count;
    }
}
fillTaskOnPage();


// Get the add button element from the DOM
const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", async () => {
    const {
        value: title
    } = await Swal.fire({
        input: "textarea",
        inputLabel: "Task title",
        inputPlaceholder: "Type the title of your new task",
        showCancelButton: true,
    });

    const {
        value: assign
    } = await Swal.fire({
        input: "text",
        inputLabel: "Assignee",
        inputPlaceholder: "Type the name of the assignee",
        showCancelButton: true,
    });

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} | ${hour12}:${minute.toString().padStart(2, "0")} ${period}`;

    let taskObj = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        date: date,
        isDone: false,
        assign: assign
    };

    if (taskObj.title == "") return;
    if (taskObj.assign == "") return;
    if (taskObj.title != null && taskObj.assign != null) {
        tasks.push(taskObj);
        storeTasks();
        fillTaskOnPage();
    }
});


function deleteTask(taskId) {
    // Get the nav and main elements for blurring effect
    const navContainer = document.querySelector('nav');
    const mainContainer = document.querySelector('main');


    // Find the index of the task with the given ID
    const index = tasks.findIndex(task => task.id === taskId);

    // Get the task to be deleted
    const task = tasks[index];

    // Blur the nav and main elements
    navContainer.style.filter = 'blur(.3rem)';
    mainContainer.style.filter = 'blur(.3rem)';

    // Show a confirmation dialog to the user
    Swal.fire({
        title: `"${task.title}" task will be permanently deleted`,
        text: "You won't be able to undo this action.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#a063f5',
        confirmButtonText: 'Delete Task'
    }).then((result) => {
        // Remove the blurring effect after the dialog is closed
        navContainer.style.filter = 'none';
        mainContainer.style.filter = 'none';

        // Check if the user confirmed the deletion
        if (result.isConfirmed) {
            // Remove the task from the tasks array
            tasks.splice(index, 1);
            // Increase the number of deleted tasks
            deletedTasks++;
            storeTasks();
            fillTaskOnPage();
        }
    });
}


// This function toggles the completion status of a task based on its id
function toggleTaskCompletion(taskId) {
    // Get the task object with the given id
    let task = tasks.find(task => task.id === taskId);
    // Toggle the isDone property of the task object
    task.isDone = !task.isDone;
    // Save the updated tasks array to local storage
    storeTasks();
    // Refresh the task list on the page to reflect the updated status
    fillTaskOnPage();
}


function storeTasks() {
    try {
        // Convert the tasks array to a JSON string
        let taskString = JSON.stringify(tasks);
        // Save the stringified tasks array to local storage under the key "tasks"
        localStorage.setItem("tasks", taskString);
    } catch (e) {
        console.error("Error storing tasks in local storage:", e);
        // Handle the error as appropriate (e.g. show an error message to the user)
    }
}


// This event listener is triggered when the user types into the search box
const searchInput = document.querySelector("#searchbox");
searchInput.addEventListener("input", function () {
    // Get the current value of the search box and convert it to lowercase
    const searchTerm = searchInput.value.toLowerCase();
    // Loop through each task element on the page
    tasks.forEach((task, index) => {
        const taskElement = document.querySelector(`.task:nth-of-type(${index + 1})`);
        // If the task's title contains the search term, show the task element
        if (task.title.toLowerCase().includes(searchTerm)) {
            taskElement.classList.remove("hide");
        } else {
            // If the task's title does not contain the search term, hide the task element
            taskElement.classList.add("hide");
        }
    });
});


// This function allows the users enter thier name. 
const userNameElement = document.querySelector('#user-name');
const navElement = document.querySelector('nav');
const mainElement = document.querySelector('main');
const userNameUnderPhotoElement = document.querySelector('.user-span');
let firstName;

// Check if user has already entered their name
const nameEntered = localStorage.getItem('nameEntered');
if (nameEntered) {
    // User has already entered their name, display it
    userNameElement.innerHTML = localStorage.getItem('name');
    userNameUnderPhotoElement.innerHTML = localStorage.getItem('name');
} else {
    // User has not entered their name, show the prompt
    promptUserForName();
}

function promptUserForName() {
    window.addEventListener("load", () => {
        async function getFirstName() {
            navElement.style.filter = 'blur(.3rem)';
            mainElement.style.filter = 'blur(.3rem)';
            const result = await Swal.fire({
                input: 'textarea',
                inputLabel: 'Please enter your name to improve the user experience👋🏻 ',
                inputPlaceholder: 'Type your First Name here...',
                inputAttributes: {
                    'aria-label': 'Type your message here'
                },
                showCancelButton: true
            });
            navElement.style.filter = 'none';
            mainElement.style.filter = 'none';
            if (result.isConfirmed) {
                // User entered their name, store it and update the UI
                firstName = result.value ? result.value : 'User';
                localStorage.setItem('name', firstName);
                localStorage.setItem('nameEntered', true);
                userNameElement.innerHTML = firstName;
                userNameUnderPhotoElement.innerHTML = localStorage.getItem('name');
            } else {
                userNameElement.innerHTML = "User";
                userNameUnderPhotoElement.innerHTML = "User";
            }
        }
        getFirstName()
    });
}