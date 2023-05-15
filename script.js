function addTime() {
  const timeInput = document.getElementById("timeInput").value;
  const [hours, minutes] = timeInput.split(":").map(Number);

  if (!isNaN(hours) && !isNaN(minutes)) {
    const totalTime = getTotalTime();
    const updatedHours = totalTime.hours + hours;
    const updatedMinutes = totalTime.minutes + minutes;

    const totalHours = Math.floor(updatedMinutes / 60) + updatedHours;
    const totalMinutes = updatedMinutes % 60;

    const totalTimeSpan = document.getElementById("totalTime");
    totalTimeSpan.textContent = `Total Time: ${totalHours} hours ${totalMinutes} minutes`;

    saveTotalTime(totalHours, totalMinutes);
  }

  document.getElementById("timeInput").value = "";
}

function resetTime() {
  localStorage.removeItem("totalTime");
  const totalTimeSpan = document.getElementById("totalTime");
  totalTimeSpan.textContent = "Total Time: 0 hours 0 minutes";
}

function getTotalTime() {
  const storedTime = localStorage.getItem("totalTime");
  if (storedTime) {
    return JSON.parse(storedTime);
  }
  return { hours: 0, minutes: 0 };
}

function saveTotalTime(hours, minutes) {
  const totalTime = { hours, minutes };
  localStorage.setItem("totalTime", JSON.stringify(totalTime));
}

window.addEventListener("load", function () {
  const totalTime = getTotalTime();
  const totalTimeSpan = document.getElementById("totalTime");
  totalTimeSpan.textContent = `Total Time: ${totalTime.hours} hours ${totalTime.minutes} minutes`;
});


