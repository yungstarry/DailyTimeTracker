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
