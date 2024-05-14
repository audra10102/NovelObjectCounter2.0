let leftTimerId, rightTimerId;
let leftStartTime, rightStartTime;
let totalLeftObjectTime = 0, totalRightObjectTime = 0;
let leftObjectEncounters = 0, rightObjectEncounters = 0;
let mouseCount = 1;

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft' && !leftTimerId) {
    leftStartTime = Date.now();
    leftObjectEncounters++;
    updateLeftObjectEncounters();
    leftTimerId = setInterval(updateLeftTimer, 1);
    const leftTimerElement = document.getElementById('leftTimer');
    if (leftTimerElement) leftTimerElement.classList.add('running');
  } else if (event.key === 'ArrowRight' && !rightTimerId) {
    rightStartTime = Date.now();
    rightObjectEncounters++;
    updateRightObjectEncounters();
    rightTimerId = setInterval(updateRightTimer, 1);
    const rightTimerElement = document.getElementById('rightTimer');
    if (rightTimerElement) rightTimerElement.classList.add('running');
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'ArrowLeft') {
    clearInterval(leftTimerId);
    const elapsedSeconds = calculateElapsedTime(leftStartTime);
    totalLeftObjectTime += elapsedSeconds;
    updateLeftTimer(); // Display final time
    leftTimerId = null;
    updateTotalLeftObjectTime(); // Bold styling fix
    const leftTimerElement = document.getElementById('leftTimer');
    if (leftTimerElement) leftTimerElement.classList.remove('running');
  } else if (event.key === 'ArrowRight') {
    clearInterval(rightTimerId);
    const elapsedSeconds = calculateElapsedTime(rightStartTime);
    totalRightObjectTime += elapsedSeconds;
    updateRightTimer(); // Display final time
    rightTimerId = null;
    updateTotalRightObjectTime(); // Bold styling fix
    const rightTimerElement = document.getElementById('rightTimer');
    if (rightTimerElement) rightTimerElement.classList.remove('running');
  }
});

function updateLeftTimer() {
  const elapsedTime = calculateElapsedTime(leftStartTime);
  document.getElementById('leftObjectTime').innerHTML = `<b>Left Timer:</b> <span id="leftTimer" class="running">${elapsedTime.toFixed(3)}</span> seconds`;
}

function updateRightTimer() {
  const elapsedTime = calculateElapsedTime(rightStartTime);
  document.getElementById('rightObjectTime').innerHTML = `<b>Right Timer:</b> <span id="rightTimer" class="running">${elapsedTime.toFixed(3)}</span> seconds`;
}

function calculateElapsedTime(startTime) {
  if (startTime) {
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - startTime) / 1000;
    return elapsedSeconds;
  }
  return 0;
}

function updateTotalLeftObjectTime() {
  document.getElementById('totalLeftObjectTime').innerHTML = `<b>Total Left Object Exploration Time:</b> ${totalLeftObjectTime.toFixed(3)} seconds`;
}

function updateTotalRightObjectTime() {
  document.getElementById('totalRightObjectTime').innerHTML = `<b>Total Right Object Exploration Time:</b> ${totalRightObjectTime.toFixed(3)} seconds`;
}

function updateLeftObjectEncounters() {
  document.getElementById('leftObjectEncounters').innerHTML = `<b>Left Object Encounters:</b> ${leftObjectEncounters}`;
}

function updateRightObjectEncounters() {
  document.getElementById('rightObjectEncounters').innerHTML = `<b>Right Object Encounters:</b> ${rightObjectEncounters}`;
}

function copyRow(row) {
  const cells = row.cells;
  let rowData = "";
  for (let i = 1; i < cells.length - 1; i++) { // Skip first and last column
    rowData += cells[i].innerText + "\t"; // Tab separated values
  }
  navigator.clipboard.writeText(rowData);

  // Get the cell containing the "Copy" button
  const copyButtonCell = row.cells[row.cells.length - 1];

  // Create pop-up message
  const popup = document.createElement('div');
  popup.innerHTML = 'Copied';
  popup.classList.add('popup');

  // Get the position of the "Copy" button
  const buttonRect = copyButtonCell.getBoundingClientRect();

  // Set position of the pop-up message relative to the button
  popup.style.position = 'fixed';
  popup.style.top = `${buttonRect.top - 40}px`; // Adjust as needed
  popup.style.left = `${buttonRect.right}px`; // Adjust as needed

  document.body.appendChild(popup);

  // Remove pop-up message after 2 seconds
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(popup); // Remove pop-up message from the body
    }, 1000);
  }, 2000);
}

function nextMouse() {
  // Create a new row in the table
  const dataTable = document.getElementById('dataTable');
  const newRow = dataTable.insertRow(-1);

  // Insert data into the new row
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4);
  const cell6 = newRow.insertCell(5);
  const cell7 = newRow.insertCell(6); // New cell for copy button

  const totalObjectExplorationTime = totalLeftObjectTime + totalRightObjectTime;

  cell1.innerHTML = mouseCount;
  cell1.classList.add('editable');
  cell1.onclick = function() { startEditing(cell1); };
  cell2.innerHTML = totalLeftObjectTime.toFixed(3);
  cell3.innerHTML = leftObjectEncounters;
  cell4.innerHTML = totalRightObjectTime.toFixed(3);
  cell5.innerHTML = rightObjectEncounters;
  cell6.innerHTML = totalObjectExplorationTime.toFixed(3);
  cell7.innerHTML = '<button onclick="copyRow(this.parentElement.parentElement)">Copy</button>'; // Add copy button

  // Reset timers and counters
  totalLeftObjectTime = 0;
  totalRightObjectTime = 0;
  leftObjectEncounters = 0;
  rightObjectEncounters = 0;
  updateLeftTimer();
  updateRightTimer();
  updateTotalLeftObjectTime(); // Bold styling fix
  updateTotalRightObjectTime(); // Bold styling fix
  updateLeftObjectEncounters();
  updateRightObjectEncounters();

  // Update the display to show zero for timers
  document.getElementById('leftObjectTime').innerHTML = `<b>Left Timer:</b> <span id="leftTimer" class="running">0.000</span> seconds`;
  document.getElementById('rightObjectTime').innerHTML = `<b>Right Timer:</b> <span id="rightTimer" class="running">0.000</span> seconds`;
  document.getElementById('totalLeftObjectTime').innerHTML = `<b>Total Left Object Exploration Time:</b> 0.000 seconds`;
  document.getElementById('totalRightObjectTime').innerHTML = `<b>Total Right Object Exploration Time:</b> 0.000 seconds`;
  document.getElementById('leftObjectEncounters').innerHTML = `<b>Left Object Encounters:</b> 0`;
  document.getElementById('rightObjectEncounters').innerHTML = `<b>Right Object Encounters:</b> 0`;

  // Increment mouse count
  mouseCount++;
}

function downloadData() {
  const dataTable = document.getElementById('dataTable');
  const csvContent = [];
  for (let i = 0; i < dataTable.rows.length; i++) {
    const row = [];
    for (let j = 0; j < dataTable.rows[i].cells.length; j++) {
      row.push(dataTable.rows[i].cells[j].innerText);
    }
    csvContent.push(row.join(','));
  }

  const csvData = 'data:text/csv;charset=utf-8,' + csvContent.join('\n');
  const encodedUri = encodeURI(csvData);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'novel_object_recognition_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyTable() {
  const dataTable = document.getElementById('dataTable');
  const range = document.createRange();
  range.selectNode(dataTable);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  alert('Table copied to clipboard!');
}

function startEditing(cell) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = cell.textContent.trim();
  input.addEventListener("blur", () => stopEditing(cell, input));
  cell.innerHTML = "";
  cell.appendChild(input);
  input.focus();
}

function stopEditing(cell, input) {
  cell.textContent = input.value;
}



