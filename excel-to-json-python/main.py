import pandas as pd
import json

def excel_to_json(excel_file_path):
    # Load the Excel workbook
    workbook = pd.ExcelFile(excel_file_path)
    
    # Prepare the output structure
    output = []

    for sheet_name in workbook.sheet_names:
        sheet_df = pd.read_excel(workbook, sheet_name=sheet_name)

        rows_list = sheet_df.to_dict(orient='records')

        sheet_data = {
            "sheetName": sheet_name,
            "rows": rows_list
        }
        
        output.append(sheet_data)
    
    return json.dumps(output, indent=4)

# Example usage
excel_file_path = 'input.xlsx'
json_output = excel_to_json(excel_file_path)

print(json_output)

# Optionally, you can save the JSON output to a file
with open('output.json', 'w') as json_file:
    json_file.write(json_output)
