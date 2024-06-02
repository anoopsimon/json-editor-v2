
$(document).ready(function () {
    jsonEditorInit('table_container', 'Textarea1', 'result_container', 'json_to_table_btn', 'table_to_json_btn');

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



