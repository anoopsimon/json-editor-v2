var counter_id;

var parent_clicked_row;
var parent_clicked_col;
var parent_counter_id;

var gbl_table_container_id;
var gbl_json_input_container_id;
var gbl_json_output_container_id;
var gbl_json_to_table_btn_id;
var gbl_table_to_json_btn_id;

var copied_row;
var copied_column;

var max_counter = 0;

var obj_clicked_row = {};
var obj_clicked_col = {};

const usageTips = [
    "Click on <strong> Upload a JSON File </strong> button",
    "Click <strong> Show/Hide </strong> to toggle textarea display",
    "Click <strong>'View JSON as Table'</strong> to show and edit the JSON data.",
    "JSON will be displayed as a TABLE, which can be edited using Click , Type and Context Menu(Right Click) options",
    "Click on <strong> View and Copy Modified JSON</strong> button to copy modified JSON to clipboard",
    "Copied content will be downloaded to default download location with file name <strong> UpdatedJson.json</strong>"
];

function renderTips(){
        const tipsList = document.getElementById('tipsList');
        tipsList.innerHTML = ''; 

        usageTips.forEach(tip => {
            const listItem = document.createElement('li');
            listItem.innerHTML = tip;
            tipsList.appendChild(listItem);
        });
    }

   

function jsonEditorInit(table_container_id, json_input_container_id, json_output_container_id, json_to_table_btn_id, table_to_json_btn_id) {
    
    gbl_table_container_id = table_container_id;
    gbl_json_input_container_id = json_input_container_id;
    gbl_json_output_container_id = json_output_container_id;
    gbl_json_to_table_btn_id = json_to_table_btn_id;
    gbl_table_to_json_btn_id = table_to_json_btn_id;

    // Load JSON from storage
    loadJsonFromStorage();
    $('#' + table_to_json_btn_id).on('click', function(){
        var jsonData = makeJson();
        saveJsonToStorage(jsonData); // Save JSON to storage
        var j = JSON.stringify(jsonData);
    
        var jsonObject = JSON.parse(j);
        var prettyJsonString = JSON.stringify(jsonObject, null, 4); // 4-space indentation
    
        var container = document.getElementById(json_output_container_id);
        var textarea = container.querySelector('textarea');
    
        if (!textarea) {
            textarea = document.createElement('textarea');
            textarea.className ='json-viewer';
            container.appendChild(textarea);
        }
    
        textarea.value = prettyJsonString;
        copyToClipboard(prettyJsonString);
        downloadJSON(prettyJsonString,'updatedJson');
    });
    
    
        //
        function copyToClipboard(jsonString) {
            navigator.clipboard.writeText(jsonString).then(function() {
                console.log('Copied to clipboard successfully!');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });

            // Show confirmation popup
            var popup = document.getElementById('confirmationPopup');
            popup.style.visibility = 'visible';
            setTimeout(function() {
                popup.style.visibility = 'hidden';
            }, 2000);
        }

    $('#' + json_to_table_btn_id).on('click', function(){
        try {
            var value = $('#' + json_input_container_id).val().trim();
            json_arr = JSON.parse(value != "" ? value : "[{\" \":\" \"}]");
        } catch(e) {
            alert(e);
            return;
        }
        $('#' + table_container_id ).html(makeTable(json_arr));
        $('.json_table').addClass('table table-bordered table-striped table-hover table-sm');
        $('.json_table thead').addClass('thead-dark');
        document.getElementById("table_to_json_btn").style.display="block";
    });
}

$(function() {
    $.contextMenu({
        selector: '#json_table_1', 
        callback: function(key, options) {

            clicked_col = obj_clicked_col[counter_id];
            clicked_row = obj_clicked_row[counter_id];

            switch(key){   
                case 'insertCR':
                    var col_heading = prompt("Enter the heading of the new column");
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                        new_th = `<th counter-id=${counter_id}><div contenteditable=true>` + col_heading + '</div></th>';
                        new_td = `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`; 
                        $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).after(new_th);
                        $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).after(new_td);
                    });
                    break;
                case 'insertCL':
                    var col_heading = prompt("Enter the heading of the new column");
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                        new_th = `<th counter-id=${counter_id}><div contenteditable=true>` + col_heading + '</div></th>';
                        new_td = `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`; 
                        $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).before(new_th);
                        $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).before(new_td);
                    });
                    break;
                case 'deleteC':
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).each(function(){
                        $(this).find(`th[counter-id=${counter_id}]`).eq(clicked_col).remove();
                        $(this).find(`td[counter-id=${counter_id}]`).eq(clicked_col).remove();
                    });
                    break;
                case 'insertRD':
                    td_length = $(`#json_table_${counter_id} tr[counter-id=${counter_id}] th[counter-id=${counter_id}]`).length;
                    new_tr = `<tr counter-id=${counter_id}>` + `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`.repeat(td_length) + "</tr>" ;     
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).after(new_tr);
                    break;
                case 'insertRU':
                    td_length = $(`#json_table_${counter_id} tr[counter-id=${counter_id}] th[counter-id=${counter_id}]`).length;
                    new_tr = `<tr counter-id=${counter_id}>` + `<td counter-id=${counter_id} td_attr="value"><div contenteditable="true"></div></td>`.repeat(td_length) + "</tr>" ;     
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).before(new_tr);
                    break;
                case 'deleteR':
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).remove();
                    break;
                case 'deleteT':
                    $(`#json_table_${counter_id}`).remove();
                    cell = $(`#json_table_${parent_counter_id} tr[counter-id=${parent_counter_id}]`).eq(parent_clicked_row+1).find(`td[counter-id=${parent_counter_id}]`).eq(parent_clicked_col);
                    $(cell).html('<div contenteditable="true"></div>');
                    $(cell).attr('td_attr','value');
                    break;
                case 'copyRow':
                    copied_row = $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).clone();
                    break;
                case 'pasteRow':
                    var inner_tables = $(copied_row).find('td table');
                    var inner_table_count = $(inner_tables).length;
                    for(var i = 0; i < inner_table_count; i++){
                        var t = inner_tables[i].outerHTML;
                        updated_table = update_table_id(t, max_counter++);
                        $(inner_tables[i].parentNode).html(updated_table);
                    }
                    $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).after(copied_row[0].outerHTML);
                    break;
                case 'addT':
                    addTable();
                    break;
            }  
            saveJsonToStorage(makeJson()); // Save JSON to storage after each modification
        },
        items: {
            "insertCR": {name: "Insert column at right side", icon: "fas fa-arrow-right"},
            "insertCL": {name: "Insert column at left side", icon: "fas fa-arrow-left"},
            "deleteC": {name: "Delete this column", icon: "fas fa-trash-alt"},
            "sep1": "---------",
            "insertRD": {name: "Insert Row under this cell", icon: "fas fa-arrow-down"},
            "insertRU": {name: "Insert Row above this cell", icon: "fas fa-arrow-up"},
            "deleteR": {name: "Delete this row", icon: "fas fa-trash-alt"},
            "sep2": "---------",
            "addT": {name: "Add a new table in this cell", icon: "fas fa-plus"},
            "deleteT": {name: "Delete parent table of selected cell", icon: "fas fa-trash-alt"},
            "sep3": "---------",
            "copyRow": {name: "Copy current row", icon: "fas fa-arrows-alt-h"},
            "pasteRow": {name: "Insert copied row", icon: "fas fa-arrows-alt-h"},
        }
    });

    $(document).on('contextmenu', "#json_table_1 td,th", function(e){
        counter_id = $(e.target).closest("tr").attr("counter-id");
        current_counter_id = $(e.currentTarget).attr("counter-id")
        obj_clicked_col[current_counter_id] = $(this).index();
        obj_clicked_row[current_counter_id] = $(this).closest('tr').index();
    }); 
});

function update_table_id(table_string, max_counter){
    var pos1, pos2;
    var id;
    var new_table_string;
    pos1 = table_string.indexOf('counter-id="');
    pos2 = table_string.indexOf('id="json_table');
    id_string = table_string.substring(pos1, pos2-1)
    pos1 = id_string.indexOf('"');
    pos2 = id_string.lastIndexOf('"');
    id = id_string.substring(pos1+1,pos2)
    new_table_string = table_string.replace(new RegExp(id_string, 'g'), `counter-id="${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_header_' + id + '"', 'g'), `"json_table_header_${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_body_' + id + '"', 'g'), `"json_table_body_${max_counter+1}"`)
    new_table_string = new_table_string.replace(new RegExp('"json_table_' + id + '"', 'g'), `"json_table_${max_counter+1}"`)
    return new_table_string;
}

function addTable(){
    clicked_col = obj_clicked_col[counter_id];
    clicked_row = obj_clicked_row[counter_id];
    max_counter++;
    table_template = `<table class="json_table" counter-id="${max_counter}" id="json_table_${max_counter}">
                        <thead counter-id="${max_counter}" id="json_table_header_${max_counter}">
                            <tr counter-id="${max_counter}">
                                <th counter-id="${max_counter}"> <div contenteditable=true> id </div> </th>
                            </tr>
                        </thead>
                        <tbody counter-id="${max_counter}" id="json_table_body_${max_counter}">
                            <tr counter-id="${max_counter}">
                                <td counter-id="${max_counter}" td_attr="value">
                                    <div contenteditable="true">1</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>`;
    cell = $(`#json_table_${counter_id} tr[counter-id=${counter_id}]`).eq(clicked_row+1).find(`td[counter-id=${counter_id}]`).eq(clicked_col);
    $(cell).html(table_template);
    $(cell).attr('td_attr','array');
    $(`#json_table_${max_counter}`).addClass('table table-bordered table-striped table-hover table-sm');
    $(`#json_table_${max_counter} thead[counter-id=${max_counter}]`).addClass('thead-dark');
    saveJsonToStorage(makeJson()); // Save JSON to storage after each modification
}

function makeTable(obj_for_table, counter = 1){
    var table_html = jQuery.parseHTML( `<table class = "json_table" counter-id = ${counter} id = "json_table_${counter}"></table>` );
    var i= 0;
    var header_names = {};
    var local_counter = counter;
    var td_attr;
    $.each(obj_for_table, function(level1_k, level1_v){
        $.each(level1_v, function(k, v){
            if(jQuery.type(v) == 'object'){
                value = makeTable( JSON.parse(  "[" + JSON.stringify(v) + "]" ), counter+1 );
                counter++;
                max_counter = counter;
                td_attr = 'obj';
            } else if(jQuery.type(v) == 'array'){
                value = makeTable( v, counter+1 );
                counter++;
                max_counter = counter;
                td_attr = 'array';
            } else {
                value = "<div contenteditable=true>" + v + "</div>";
                td_attr = 'value';
            }
            if(typeof(header_names[k]) == "undefined" ){
                header_names[k] = i;
                insertColumn(table_html, k, local_counter);
                i++;
            }
            var cell = $(table_html).find('tr[counter-id="' + local_counter + '"]').last().find('td[counter-id="' + local_counter + '"]').eq(header_names[k]);
            $(cell).attr('td_attr',td_attr);
            $(cell).attr('counter-id',local_counter);  
            $(cell).html(value);  
        });
        td_list = `<td counter-id = ${local_counter} ><div contenteditable=true></div></td>`.repeat(i); 
        $(table_html).append( `<tr counter-id = ${local_counter}>' ${td_list} '</tr>`);
    });
    $(table_html).find('tr').last().remove();
    $(table_html).find('td').each(function(td_i,td_v){
        if($(td_v).attr('td_attr') == undefined){
            $(td_v).attr('td_attr','value');
        }
    });
    return table_html;
}

function insertColumn(table_ref, header_name, counter) {
    if( !$(table_ref).find('tr[counter-id="' + counter + '"]').first().length ){
        var thead = `<thead counter-id = ${counter} id = "json_table_header_${counter}"><tr counter-id = ${counter}><th counter-id = ${counter} > <div contenteditable=true> ${header_name} </div> </th></tr></thead>`;
        var tbody = `<tbody counter-id = ${counter} id = "json_table_body_${counter}"><tr counter-id = ${counter}><td counter-id = ${counter} ><div contenteditable=true></div></td></tr></tbody>`;
        $(table_ref).append(thead);
        $(table_ref).append(tbody);
    } else {
        $(table_ref).find('tr[counter-id="' + counter + '"]').each(function(){
            $(this).append(`<td counter-id = ${counter} ><div contenteditable=true></div></td>`);
        })
    }
    var inserted_td = $(table_ref).find('tr[counter-id="' + counter + '"]').first().find('td[counter-id="' + counter + '"]').last();
    $(inserted_td).html(header_name);
    $(inserted_td).replaceWith(`<th counter-id = ${counter}><div contenteditable=true>` + $(inserted_td).html() + `</div></th>`);
}

function makeJson(counter = 1){
    var header = [];
    var data = [];
    $('#json_table_header_'+ counter + ' th').each(function(i, v){
        header[i] = $(this).text().trim();
    });
    var row_finder = `#json_table_body_${counter} tr[counter-id=${counter}]`;
    $(row_finder).each(function(row_i, row_v){
        var obj = {};
        $(header).each(function(header_i, header_value){
            var cell = $(row_v).children('td').eq(header_i);
            var td_attr = $(cell).attr('td_attr');
            var inner_text = $(cell).children('div').text().trim();
            var inner_table = $(cell).find('table');
            switch(td_attr){
                case 'value':
                    if(inner_text != "" && inner_text != null)
                        obj[header_value] = inner_text;
                    break;
                case 'obj':
                case 'array':
                    obj[header_value] = makeJson( $(inner_table).attr('counter-id') );
                    break;
                default:
                    break;
            }
        });
        data.push(obj);
    });
    return data;
}

function saveJsonToStorage(jsonData) {
    console.log("saving to session storage");
    sessionStorage.setItem('jsonTableData', JSON.stringify(jsonData));
}

function loadJsonFromStorage() {
    var storedJson = sessionStorage.getItem('jsonTableData');
    if (storedJson) {
        var jsonData = JSON.parse(storedJson);
        $('#' + gbl_table_container_id).html(makeTable(jsonData));
        $('.json_table').addClass('table table-bordered table-striped table-hover table-sm');
        $('.json_table thead').addClass('thead-dark');
    }
}

$(document).ready(function () {
    jsonEditorInit('table_container', 'Textarea1', 'result_container', 'json_to_table_btn', 'table_to_json_btn');
    renderTips();
    $('#file_input').on('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#Textarea1').val(e.target.result);
                $('#Textarea1').show();
            }
            reader.readAsText(file);
        }

        //show buttons => Show/Hide
        document.getElementById("textarea_buttons").style.display = "block";
        document.getElementById("json_to_table_btn").style.display = "block";
    });

    $('#expand_btn').on('click', function () {
        $('#Textarea1').show();
        $('#Textarea1').css('height', '400px');
    });

    $('#collapse_btn').on('click', function () {
        $('#Textarea1').hide();

    });
});

function downloadJSON(jsonString, filename) {
   
    console.log('Dowloading to file ' + filename);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}
