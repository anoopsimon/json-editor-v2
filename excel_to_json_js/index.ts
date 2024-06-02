import * as xlsx from 'xlsx';
import * as fs from 'fs';

interface Row {
    [key: string]: string | number | boolean;
}

interface SheetData {
    sheetName: string;
    rows: Row[];
}

function excelToJson(excelFilePath: string): SheetData[] {
    const workbook = xlsx.readFile(excelFilePath);
    const result: SheetData[] = [];

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows: Row[] = xlsx.utils.sheet_to_json<Row>(sheet, { defval: "" });

        const sheetData: SheetData = {
            sheetName: sheetName,
            rows: rows
        };

        result.push(sheetData);
    });

    return result;
}

// Example usage
const excelFilePath: string = 'input.xlsx';
const jsonOutput: SheetData[] = excelToJson(excelFilePath);
const jsonString: string = JSON.stringify(jsonOutput, null, 4);

console.log(jsonString);

// Optionally, save the JSON output to a file
fs.writeFileSync('output.json', jsonString);
