import fs from 'fs-extra';
import path from 'path';
import { format, differenceInDays } from 'date-fns';

interface ExcelFile {
  path: string;
  created: Date;
  modified: Date;
  daysSinceLastUpdate: number;
}

const targetDirectory: string = 'C:/Users/s4514/dev/js/json-editor/excel_to_json_js'; // Change this to your target folder

// Helper function to format date
const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd HH:mm:ss');

// Function to scan directory recursively and find Excel files
const scanDirectory = async (dir: string): Promise<ExcelFile[]> => {
  const files: string[] = await fs.readdir(dir);
  const excelFiles: ExcelFile[] = [];

  for (const file of files) {
    const fullPath: string = path.join(dir, file);
    const stat: fs.Stats = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subDirFiles: ExcelFile[] = await scanDirectory(fullPath);
      excelFiles.push(...subDirFiles);
    } else if (fullPath.endsWith('.xlsx') || fullPath.endsWith('.xls')) {
      const created: Date = stat.birthtime;
      const modified: Date = stat.mtime;
      const daysSinceLastUpdate: number = differenceInDays(new Date(), modified);
      excelFiles.push({ path: fullPath, created, modified, daysSinceLastUpdate });
    }
  }

  return excelFiles;
};

// Function to generate HTML report
const generateHtmlReport = (excelFiles: ExcelFile[]): string => {
  const html: string = `
<!DOCTYPE html>
<html>
<head>
    <title>Excel File Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Excel File Report</h1>
    <table>
        <tr>
            <th>File Path</th>
            <th>Created</th>
            <th>Last Modified</th>
            <th>Days Since Last Update</th>
        </tr>
        ${excelFiles.map(file => `
        <tr>
            <td>${file.path}</td>
            <td>${formatDate(file.created)}</td>
            <td>${formatDate(file.modified)}</td>
            <td>${file.daysSinceLastUpdate}</td>
        </tr>`).join('')}
    </table>
</body>
</html>`;
  return html;
};

// Main function to scan directory and generate report
const generateReport = async (): Promise<void> => {
  try {
    const excelFiles: ExcelFile[] = await scanDirectory(targetDirectory);
    const htmlReport: string = generateHtmlReport(excelFiles);
    await fs.writeFile('ExcelReport.html', htmlReport);
    console.log('Report generated: ExcelReport.html');
  } catch (error) {
    console.error('Error generating report:', error);
  }
};

generateReport();
