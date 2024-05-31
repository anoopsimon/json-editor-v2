let jsonArray = [
    {"name": "John", "age": 30, "city": "New York"},
    {"name": "Anna", "age": 22, "city": "London"},
    {"name": "Mike", "age": 32, "city": "Chicago"}
];

function createTableFromJSON() {
    const table = document.getElementById('jsonTable');
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('jsonTableBody');

    // Clear the table
    headerRow.innerHTML = '';
    tableBody.innerHTML = '';

    // Create header
    const keys = Object.keys(jsonArray[0]);
    keys.forEach(key => {
        const th = document.createElement('th');
        th.innerText = key;
        headerRow.appendChild(th);
    });

    // Create rows
    jsonArray.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        keys.forEach(key => {
            const td = document.createElement('td');
            td.contentEditable = true;
            td.innerText = row[key];
            td.dataset.row = rowIndex;
            td.dataset.key = key;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function addRow() {
    const newRow = {};
    const keys = Object.keys(jsonArray[0]);
    keys.forEach(key => newRow[key] = '');
    jsonArray.push(newRow);
    createTableFromJSON();
}

function deleteRow() {
    jsonArray.pop();
    createTableFromJSON();
}

function addCell() {
    const newKey = prompt("Enter the name for the new cell:");
    if (newKey) {
        jsonArray.forEach(row => row[newKey] = '');
        createTableFromJSON();
    }
}

function deleteCell() {
    const keys = Object.keys(jsonArray[0]);
    const keyToDelete = prompt("Enter the name of the cell to delete:", keys.join(', '));
    if (keys.includes(keyToDelete)) {
        jsonArray.forEach(row => delete row[keyToDelete]);
        createTableFromJSON();
    }
}

function updateJSON() {
    const tableBody = document.getElementById('jsonTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const rowIndex = cell.dataset.row;
            const key = cell.dataset.key;
            jsonArray[rowIndex][key] = cell.innerText;
        }
    }
    document.getElementById('jsonOutput').value = JSON.stringify(jsonArray, null, 2);
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.select();
    jsonOutput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Copied the JSON to clipboard");
}

window.onload = () => {
    createTableFromJSON();
    updateJSON();
}
