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

function getParentRowElement(dragHandle) {
  let p = dragHandle.parentElement;
  if (p.tagName == "TD") {
    return getParentRowElement(p);
  } else if (p.tagName == "TR") {
    return p;
  } else {
    // Do something with an unknown element.
    return null;
  }
}

function dragHandle_OnDragStart(ev) {
  addEventDescription(ev.target.id, "ondragstart");
  let parentRow = getParentRowElement(ev.target);
  if (parentRow !== undefined && parentRow !== null) {
    let rowId = parentRow.dataset.rowId;
    // Add the data
    if (rowId !== undefined && rowId !== null) {
      ev.dataTransfer.setData("text/plain", "" + rowId);
      ev.dataTransfer.setData("mg-dndrow/id", rowId);

      ev.dataTransfer.dropEffect = "move";
    }
    addEventDescription("rowId", rowId);
  } else {
    console.error("Invalid element dragging");
  }
}

function gridRow_OnDragOver(ev) {
  ev.preventDefault();

  ev.dataTransfer.dropEffect = "move";

  addEventDescription(ev.currentTarget.tagName, "ondropover");
}

function gridRow_OnDrop(ev) {
  ev.preventDefault();

  // Need the data now
  const receivedData = ev.dataTransfer.getData("mg-dndrow/id");

  addEventDescription(ev.currentTarget.tagName, "ondrop");
}

window.addEventListener("DOMContentLoaded", () => {
  // Add the code in here
  addEventDescription("DOMContentLoaded", "Ready to go");

  // Register drag start handlers for each of them.
  const elements = document.getElementsByClassName("drag-handle");
  for (let i = 0; i < elements.length; ++i) {
    elements[i].addEventListener("dragstart", dragHandle_OnDragStart);
  }

  const tableRows = document.getElementsByTagName("tr");
  for (let i = 0; i < tableRows.length; ++i) {
    if (tableRows[i].dataset.rowId) {
      tableRows[i].addEventListener("dragover", gridRow_OnDragOver);
      tableRows[i].addEventListener("drop", gridRow_OnDrop);
    }
  }
});
