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

function dragHandle_OnDragStart(ev) {
  addEventDescription(ev.target.id, "ondragstart");
}

window.addEventListener("DOMContentLoaded", () => {
  // Add the code in here
  addEventDescription("DOMContentLoaded", "Ready to go");

  // Register drag start handlers for each of them.
  const elements = document.getElementsByClassName("drag-handle");
  for (let i = 0; i < elements.length; ++i) {
    elements[i].addEventListener("dragstart", dragHandle_OnDragStart);
  }
});
