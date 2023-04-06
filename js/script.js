let tasks = [];
let deletedTasks = 0;


// Retrieves tasks from local storage and assigns them to a variable named "tasks".
// If there are no tasks stored in local storage, an empty array is assigned to the "tasks" variable. " Bug Foundded and solve✅ "
function getTasksFromStorage() {
    let storedTasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = storedTasks ?? [];
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
    let index = 0;
    let completedTasks = 0;
    let uncompletedTasks = 0;

    // If there are no tasks, display a message
    if (tasks.length === 0) {
        tasksContainer.innerHTML = emptyTasksContainer;
        return;
    }


    // Loop through each task and create its HTML content
    for (task of tasks) {
        let content = `
                <div class="task ${task.isDone ? "done": ""}">
                <div class="task-info">
                <h2 onclick="makeTaskEditable(${index})">${task.title}</h2>
                
                <div>
                        <span class="material-symbols-sharp">
                        calendar_month
                        </span>
                        <span>
                        ${task.date}
                        </span>
                </div>
                </div>
                <div class="task-actions">
                        <button onclick="deleteTask(${index})" class="circular btn-delete">
                        <span class="material-symbols-sharp btn-delete-icon">
                                delete
                                </span>
                        </button>
                        ${task.isDone ? `
                        <button onclick="toggleTaskCompletion(${index})" class="circular btn-done">
                        <span class="material-symbols-sharp btn-done-icon">
                                close
                        </span>
                        </button>
                        ` : 
                        `
                        <button onclick="toggleTaskCompletion(${index})" class="circular btn-isDone">
                        <span class="material-symbols-sharp btn-isDone-icon">
                                done
                                </span>
                        </button>
                        `
                }
                </div>
                <!--// TASK ACTIONS //-->
        </div>
        `;

        document.getElementById("tasks").innerHTML += content;
        index++;

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
// Add event listener to the add button
addBtn.addEventListener("click", async () => {
    const {
        value: text
    } = await Swal.fire({
        input: "textarea",
        inputLabel: "Task title",
        inputPlaceholder: "Type the title of your new task",
        showCancelButton: true,
    });
    let taskName = text;

    // Get the current date and time
    const now = new Date();

    // Get the hour and minute components of the current time
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Determine whether the current time is in AM or PM
    const period = hour >= 12 ? "PM" : "AM";

    // Convert the hour to 12-hour format
    const hour12 = hour % 12 || 12;

    // Format the date string with the hour, minute, and period
    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} | ${hour12}:${minute.toString().padStart(2, "0")} ${period}`;


    let taskObj = {
        title: taskName,
        date: date,
        isDone: false,
    };

    if (taskObj.title == "") return;
    if (taskObj.title != null) {
        tasks.push(taskObj);
        storeTasks();
        fillTaskOnPage();
    }
});


function deleteTask(index) {
    // Get the nav and main elements for blurring effect
    const navContainer = document.querySelector('nav');
    const mainContainer = document.querySelector('main');

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


// This function toggles the completion status of a task based on its index in the tasks array
function toggleTaskCompletion(index) {
    // Get the task object at the given index
    let task = tasks[index];
    // Toggle the isDone property of the task object
    task.isDone = !task.isDone;
    // Save the updated tasks array to local storage
    storeTasks();
    // Refresh the task list on the page to reflect the updated status
    fillTaskOnPage();
}


// This function saves the current state of the tasks array to local storage
function storeTasks() {
    // Convert the tasks array to a JSON string
    let taskString = JSON.stringify(tasks);
    // Save the stringified tasks array to local storage under the key "tasks"
    localStorage.setItem("tasks", taskString);
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


// This function allows the user to edit a task's title by clicking on it.
function makeTaskEditable(index) {
    // Find the task element via specified index,
    // and get the title element and the task object associated with it.
    const taskElement = document.querySelectorAll('.task')[index];
    const titleElement = taskElement.querySelector('h2');
    const task = tasks[index];

    // Add a click event listener to the title element that toggles between
    // display mode and edit mode.
    titleElement.addEventListener('click', () => {
        // If the task is already marked as done, don't allow editing.
        if (task.isDone === true) {
            return;
        }

        // Get the current title and create an input element with the same value.
        const currentTitle = titleElement.textContent;
        const inputElement = document.createElement('input');
        inputElement.value = currentTitle;
        inputElement.classList.add('task-input');

        // Replace the title element with the input element.
        titleElement.replaceWith(inputElement);

        // Focus and select the input element so the user can start typing right away.
        inputElement.focus();
        inputElement.select();

        // Add a keydown event listener to the input element to handle the
        // "Enter" key and save the edited title.
        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                // Prevent the default behavior of the "Enter" key (submitting the form).
                event.preventDefault();
                // Get the new title from the input element and trim any whitespace.
                const newTitle = inputElement.value.trim();
                // If the new title is not empty, update the task object and save it to local storage.
                if (newTitle) {
                    // Check again whether the task is done, in case it was marked as done
                    // while the user was editing the title.
                    if (task.isDone === true) {
                        return;
                    }
                    // Update the task object and save it to local storage.
                    tasks[index].title = newTitle;
                    storeTasks();
                    // Update the task element on the page with the new title.
                    fillTaskOnPage();
                }
            }
        });
    });
}


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