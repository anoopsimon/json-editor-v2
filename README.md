# Json Toolsets

1. Excel to JSON converter - JS & Python

Implemented as two projects using Typescript as well as Python. Refer readme files for details.

### Overview
Input : Excel Workbook ( `.xlsx`)

Output : `JSON` file [Each Sheet will be an Array. Rows will be displayed as array in rows object]

Output format : 

```
[
    {
        "sheetName": "Login",
        "rows": [
            {
                "FieldName": "Hello",
                "ControlType": "Input",
                "Selector": "#ASDFG",
                "TestCaseID": "TC123456"
            },
            {
                "FieldName": "FieldZXCVB",
                "ControlType": "Input",
                "Selector": "#QWERT",
                "TestCaseID": "TC234567"
            },
            {
                "FieldName": "N",
                "ControlType": "N1",
                "Selector": "N2",
                "TestCaseID": "N3"
            },
            {
                "FieldName": "FieldASDFG",
                "ControlType": "Input",
                "Selector": "#ZXCVB",
                "TestCaseID": "TC345678"
            },
            {
                "FieldName": "John",
                "ControlType": "Snow",
                "Selector": "Is ",
                "TestCaseID": "From"
            }
        ]
    },
    {
        "sheetName": "Product Selection",
        "rows": [
            {
                "FieldName": "FieldQWERT",
                "ControlType": "Input",
                "Selector": "#ASDFG",
                "TestCaseID": "Game"
            },
            {
                "FieldName": "FieldZXCVB",
                "ControlType": "Input",
                "Selector": "#QWERT",
                "TestCaseID": "Thrones"
            },
            {
                "FieldName": "FieldASDFG",
                "ControlType": "Input",
                "Selector": "#ZXCVB",
                "TestCaseID": "Of"
            }
        ]
    }
]
```

2. JSON Table Editor
Edit Json as Table