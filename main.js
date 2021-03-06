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

function dragHandle_OnDragEnd(ev) {
  ev.preventDefault();

  addEventDescription(
    ev.currentTarget.id,
    "dragend - " + ev.dataTransfer.dropEffect
  );

  if (ev.dataTransfer.dropEffect == "move") {
    let parentRow = getParentRowElement(ev.target);
    if (parentRow !== undefined && parentRow !== null) {
    }
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

  let dropRow = getParentRowElement(ev.target);
  addEventDescription(
    ev.currentTarget.tagName,
    "ondrop " + dropRow.dataset.rowId + ", new row is " + receivedData
  );

  // Grabbing the table element itself.
  const tableElement = document.getElementById("dragTable");

  let rowToMove = null;
  let dropIndex = -1;
  let removeIndex = -1;

  if (tableElement !== undefined && tableElement !== null) {
    for (let i = 0; i < tableElement.rows.length; ++i) {
      if (tableElement.rows[i].dataset.rowId === receivedData) {
        rowToMove = tableElement.rows[i];
        removeIndex = i;
      }

      if (tableElement.rows[i] === dropRow) {
        dropIndex = i;
      }

      // Can terminate now
      if (rowToMove !== null && dropIndex >= 0) {
        break;
      }
    }
  }

  if (rowToMove && dropRow && dropIndex >= 0) {
    let p = rowToMove.parentNode;

    // Moving it ahead in the table, that's a special case because of the insertBefore API
    if (removeIndex < dropIndex) {
      // Either the last element, or handle the proper needs.
      // The last row is a special case.
      if (dropIndex === tableElement.rows.length - 1) {
        // No more rows to drop at, we're done, so put it into the end of the table and continue.
        rowToMove.parentNode.removeChild(rowToMove);
        p.appendChild(rowToMove);
        return;
      } else {
        // Grab the row after it to
        dropRow = tableElement.rows[dropIndex + 1];
      }
    }

    // Removing the original one from there.
    rowToMove.parentNode.removeChild(rowToMove);
    p.insertBefore(rowToMove, dropRow);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Add the code in here
  addEventDescription("DOMContentLoaded", "Ready to go");

  // Register drag start handlers for each of them.
  const elements = document.getElementsByClassName("drag-handle");
  for (let i = 0; i < elements.length; ++i) {
    elements[i].addEventListener("dragstart", dragHandle_OnDragStart);
    elements[i].addEventListener("dragend", dragHandle_OnDragEnd);
  }

  const tableRows = document.getElementsByTagName("tr");
  for (let i = 0; i < tableRows.length; ++i) {
    if (tableRows[i].dataset.rowId) {
      tableRows[i].addEventListener("dragover", gridRow_OnDragOver);
      tableRows[i].addEventListener("drop", gridRow_OnDrop);
    }
  }
});
