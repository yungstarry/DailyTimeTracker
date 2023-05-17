window.addEventListener("load", function () {
  const addButton = document.getElementById("addButton");
  const resetButton = document.getElementById("resetButton");
  const totalTimeSpan = document.getElementById("totalTime");

  addButton.addEventListener("click", addTime);
  resetButton.addEventListener("click", resetTime);

  // Retrieve total time from local storage and display
  const totalTime = getTotalTime();
  updateTimeDisplay(totalTime);

  function addTime() {
    const timeInput = document.getElementById("timeInput").value;
    const [hours, minutes] = timeInput.split(":").map(Number);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalTime = getTotalTime();
      const updatedHours = totalTime.hours + hours;
      const updatedMinutes = totalTime.minutes + minutes;

      const totalHours = Math.floor(updatedMinutes / 60) + updatedHours;
      const totalMinutes = updatedMinutes % 60;

      const currentTime = new Date();
      const timestamp = currentTime.toLocaleString();

      const updatedTotalTime = {
        hours: totalHours,
        minutes: totalMinutes,
        timestamp: timestamp,
      };
      animateFlashcard();
      saveTotalTime(updatedTotalTime);
      updateTimeDisplay(updatedTotalTime);
    }

    document.getElementById("timeInput").value = "";
  }

  function resetTime() {
    localStorage.removeItem("totalTime");
    const zeroTotalTime = { hours: 0, minutes: 0, timestamp: "" };
    saveTotalTime(zeroTotalTime);
    updateTimeDisplay(zeroTotalTime);
  }

  function getTotalTime() {
    const storedTime = localStorage.getItem("totalTime");
    if (storedTime) {
      return JSON.parse(storedTime);
    }
    return { hours: 0, minutes: 0, timestamp: "" };
  }

  function saveTotalTime(totalTime) {
    localStorage.setItem("totalTime", JSON.stringify(totalTime));
  }

  function updateTimeDisplay(totalTime) {
    const totalTimeSpan = document.getElementById("totalTime");
    const timestampSpan = document.getElementById("timestamp");

    totalTimeSpan.textContent = `Total Time: ${totalTime.hours} hours ${totalTime.minutes} minutes`;
    timestampSpan.textContent = `Last added: ${totalTime.timestamp}`;
  }
});

// const flashcard = document.getElementById("flashcard");
// function animateFlashcard() {
//   flashcard.style.backgroundColor = "lightgreen";
//   flashcard.style.transform = "scale(1.1)";
//   setTimeout(() => {
//     flashcard.style.backgroundColor = "bisque";
//     flashcard.style.transform = "scale(1)";
//   }, 10000);
// }

function animateFlashcard() {
  flashcard.classList.add("animate");

  // Remove the 'animate' class after animation ends
  flashcard.addEventListener("animationend", () => {
    flashcard.classList.remove("animate");
  });
}

// Call the animateFlashcard() function after adding the hours
addButton.addEventListener("click", () => {
  addTime();
  animateFlashcard();
});


// 




// To-do-list
// 
// 
// 

// 
const to_do_input = document.querySelector("#todo");
const list = document.querySelector("#list");
const to_do_form = document.querySelector("#to_do_form");
const sc_feedback = document.querySelector("#sc_feedback");
const heading = document.querySelector("#heading");

// Load tasks from local storage
window.addEventListener("load", function () {
  const savedTasks = getSavedTasks();
  savedTasks.forEach(function (task) {
    addTaskToDOM(task);
  });
});

// Execute functions on submit of the form
to_do_form.addEventListener("submit", function (event) {
  event.preventDefault();
  let task = to_do_input.value.trim();
  if (task !== "") {
    addTaskToDOM(task);
    saveTask(task);
    removeValue(to_do_input);
    screenReaderFeedback(task);
  }
});

// We are using Event Delegation to listen for clicks on the list
list.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete_task")) {
    const deleteIcon = event.target;
    const taskItem = deleteIcon.parentNode;
    const taskName = taskItem.querySelector("label").textContent;
    deleteTask(taskItem);
    moveFocus(heading);
    screenReaderFeedback(taskName, "Removed");
    removeTaskFromStorage(taskName);
  } else if (
    event.target.tagName === "INPUT" &&
    event.target.type === "checkbox"
  ) {
    const checkbox = event.target;
    const taskItem = checkbox.parentNode;
    const label = taskItem.querySelector("label");
    if (checkbox.checked) {
      label.style.textDecoration = "line-through";
    } else {
      label.style.textDecoration = "none";
    }
  }
});

function deleteTask(taskItem) {
  list.removeChild(taskItem);
}

// We generate a new <li>, <input type="checkbox">, and <span>
// each time a task is added to the DOM.
function addTaskToDOM(task) {
  const newID = generateID();
  const taskItem = createElement("li", ["class", "task"]);
  const theCheckbox = createElement("input", ["type", "checkbox"]);
  const label = createElement("label");
  label.textContent = task;
  theCheckbox.setAttribute("id", newID);
  taskItem.appendChild(theCheckbox);
  taskItem.appendChild(label);
  taskItem.appendChild(createDeleteIcon());

  // Add animation class to the newly added taskItem
  taskItem.classList.add("animate");

  // Insert the taskItem at the top of the list
  const firstTask = list.firstChild;
  if (firstTask) {
    list.insertBefore(taskItem, firstTask);
  } else {
    list.appendChild(taskItem);
  }

  // Remove animation class after animation duration
  setTimeout(() => {
    taskItem.classList.remove("animate");
  }, 500);
}

function createElement(tagName, attribute = null) {
  const node = document.createElement(tagName);
  if (attribute) {
    const [attr, value] = attribute;
    node.setAttribute(attr, value);
  }
  return node;
}

// Rest of the code remains unchanged...


function createDeleteIcon() {
  const deleteIcon = createElement("i", [
    "class",
    "fas fa-trash-alt delete_task",
  ]);
  deleteIcon.style.color = "red"; // Set the icon color to red
  deleteIcon.style.backgroundColor = "transparent"; // Set the icon background color to transparent
  deleteIcon.style.border = "none"; // Remove icon border

  return deleteIcon;
}

function removeValue(input) {
  input.value = "";
}

// Sighted users are able to see when a task is added, but screen reader
// users are more likely to be blind, so we want to make the
// screen reader voice the actions.
// We use the #sc_feedback element in the DOM to populate
// the text which would be voiced
function screenReaderFeedback(task, feedback = "Added") {
  const feedbackElement = document.createElement("span");
  feedbackElement.textContent = `${task} ${feedback}.`;
  feedbackElement.style.color = feedback === "Added" ? "green" : "red";
  sc_feedback.appendChild(feedbackElement);
  setTimeout(() => {
    sc_feedback.removeChild(feedbackElement);
  }, 3000);
}

function generateID() {
  const idPrefix = "task_num_";
  const tasks = document.querySelectorAll("#list > li");
  return idPrefix + tasks.length;
}

function moveFocus(element) {
  element.focus();
}

function saveTask(task) {
  const savedTasks = getSavedTasks();
  savedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function getSavedTasks() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

function removeTaskFromStorage(task) {
  const savedTasks = getSavedTasks();
  const updatedTasks = savedTasks.filter((savedTask) => savedTask !== task);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
