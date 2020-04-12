function addEventDescription(name, details) {
  const textarea = document.getElementById("eventList");
  if (textarea) {
    if (textarea.value.length > 0) {
      textarea.value += name + ": " + details + "\n";
    } else {
      textarea.value = name + ": " + details + "\n";
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Add the code in here
  addEventDescription("DOMContentLoaded", "Ready to go");
});
