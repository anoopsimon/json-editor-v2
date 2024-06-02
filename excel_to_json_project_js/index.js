const xlsx = require('xlsx');
const fs = require('fs');

function excelToJson(excelFilePath) {
    const workbook = xlsx.readFile(excelFilePath);
    const result = [];

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        const sheetData = {
            sheetName: sheetName,
            rows: rows
        };

        result.push(sheetData);
    });

    return result;
}

// Example usage
const excelFilePath = 'input.xlsx';
const jsonOutput = excelToJson(excelFilePath);
const jsonString = JSON.stringify(jsonOutput, null, 4);

console.log(jsonString);

// Optionally, save the JSON output to a file
fs.writeFileSync('output.json', jsonString);
