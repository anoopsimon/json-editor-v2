let workbook = {
    "WorkbookName": "MyWorkbook",
    "Sheets": [
        {
            "SheetName": "Sheet1",
            "Rows": [
                {"A": "John", "B": 30, "C": "New York"},
                {"A": "Anna", "B": 22, "C": "London"},
                {"A": "Mike", "B": 32, "C": "Chicago"}
            ]
        },
        {
            "SheetName": "Sheet2",
            "Rows": [
                {"A": "Product", "B": "Price", "C": "Quantity"},
                {"A": "Apple", "B": 1.2, "C": 10},
                {"A": "Banana", "B": 0.8, "C": 5},
                {"A": "Cherry", "B": 2.5, "C": 20}
            ]
        }
    ]
};

let currentSheetIndex = 0;
let contextMenuRowIndex = null;

function loadSheetSelector() {
    const sheetSelector = document.getElementById('sheetSelector');
    workbook.Sheets.forEach((sheet, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = sheet.SheetName;
        sheetSelector.appendChild(option);
    });
}

function selectSheet() {
    updateCurrentSheetData();
    currentSheetIndex = document.getElementById('sheetSelector').value;
    createTableFromJSON();
}

function createTableFromJSON() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const table = document.getElementById('jsonTable');
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('jsonTableBody');

    // Clear the table
    headerRow.innerHTML = '';
    tableBody.innerHTML = '';

    if (!sheet.Rows.length) return;

    // Create header
    const keys = Object.keys(sheet.Rows[0]);
    keys.forEach((key, index) => {
        const th = document.createElement('th');
        th.contentEditable = true;
        th.innerText = key;
        th.dataset.index = index;
        th.addEventListener('blur', updateHeader);
        headerRow.appendChild(th);
    });

    // Create rows
    sheet.Rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        tr.addEventListener('contextmenu', (event) => showContextMenu(event, rowIndex));
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
    const sheet = workbook.Sheets[currentSheetIndex];
    const newRow = {};
    const keys = Object.keys(sheet.Rows[0]);
    keys.forEach(key => newRow[key] = '');
    sheet.Rows.push(newRow);
    createTableFromJSON();
}

function deleteRow() {
    const sheet = workbook.Sheets[currentSheetIndex];
    sheet.Rows.pop();
    createTableFromJSON();
}

function addCell() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const newKey = prompt("Enter the name for the new cell:");
    if (newKey) {
        sheet.Rows.forEach(row => row[newKey] = '');
        createTableFromJSON();
    }
}

function deleteCell() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const keys = Object.keys(sheet.Rows[0]);
    const keyToDelete = prompt("Enter the name of the cell to delete:", keys.join(', '));
    if (keys.includes(keyToDelete)) {
        sheet.Rows.forEach(row => delete row[keyToDelete]);
        createTableFromJSON();
    }
}

function updateHeader(event) {
    const newKey = event.target.innerText.trim();
    const headerIndex = event.target.dataset.index;
    const sheet = workbook.Sheets[currentSheetIndex];
    const oldKey = Object.keys(sheet.Rows[0])[headerIndex];

    if (newKey && newKey !== oldKey) {
        sheet.Rows.forEach(row => {
            row[newKey] = row[oldKey];
            delete row[oldKey];
        });
        createTableFromJSON();
    }
}

function updateCurrentSheetData() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const tableBody = document.getElementById('jsonTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const rowIndex = cell.dataset.row;
            const key = cell.dataset.key;
            sheet.Rows[rowIndex][key] = cell.innerText.trim() === '' ? '' : cell.innerText;
        }
    }
}

function updateJSON() {
    updateCurrentSheetData();
    document.getElementById('jsonOutput').value = JSON.stringify(workbook, null, 2);
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.select();
    jsonOutput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Copied the JSON to clipboard");
}

function showContextMenu(event, rowIndex) {
    event.preventDefault();
    contextMenuRowIndex = rowIndex;

    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;

    document.addEventListener('click', hideContextMenu);
}

function hideContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
    document.removeEventListener('click', hideContextMenu);
}

function insertRowAbove() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const newRow = {};
    const keys = Object.keys(sheet.Rows[0]);
    keys.forEach(key => newRow[key] = '');
    sheet.Rows.splice(contextMenuRowIndex, 0, newRow);
    createTableFromJSON();
    hideContextMenu();
}

function insertRowBelow() {
    const sheet = workbook.Sheets[currentSheetIndex];
    const newRow = {};
    const keys = Object.keys(sheet.Rows[0]);
    keys.forEach(key => newRow[key] = '');
    sheet.Rows.splice(contextMenuRowIndex + 1, 0, newRow);
    createTableFromJSON();
    hideContextMenu();
}

window.onload = () => {
    loadSheetSelector();
    createTableFromJSON();
    updateJSON();
}
