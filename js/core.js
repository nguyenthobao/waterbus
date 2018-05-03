var isRound = 0;
var departureDate = $('#departureDate');
var departureBackDate = $('#departureBackDate');
var startPoint = $('#startPoint');
var endPoint = $('#endPoint');
var startPointHidden = $('#startPointHidden');
var endPointHidden = $('#endPointHidden');

var systemId = $("base").attr("id");

$(document).ready(function () {

    /*Autocomplete startPoint*/
    startPoint.autocomplete({
        source: function (request, response) {
            $.ajax({
                type: 'POST',
                url: 'https://dobody-anvui.appspot.com/point/get_province_and_point',
                dataType: "json",
                data: JSON.stringify({companyId: systemId}),
                success: function (data) {
                    listDistrict = data.results.result[0].listDistrict;
                    response(listDistrict);
                }
            });
        },
        select: function (event, ui) {
            startPoint.val(ui.item.districtName);
            startPointHidden.val(ui.item.districtId);
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.districtName + "</div>")
            .appendTo(ul);
    };

    /*Autocomplete endPoint*/
    endPoint.autocomplete({
        source: function (request, response) {
            $.ajax({
                type: 'POST',
                url: 'https://dobody-anvui.appspot.com/point/get_province_and_point',
                dataType: "json",
                data: JSON.stringify({companyId: systemId}),
                success: function (data) {
                    listDistrict = data.results.result[0].listDistrict;
                    response(listDistrict);
                }
            });
        },
        select: function (event, ui) {
            endPoint.val(ui.item.districtName);
            endPointHidden.val(ui.item.districtId);
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div data-id='" + item.districtId + "'>" + item.districtName + "</div>")
            .appendTo(ul);
    };

    $("#switchPoint").click(function () {
        var tempInput = startPoint.val();
        var tempHiden = startPointHidden.val();

        startPoint.val(endPoint.val());
        startPointHidden.val(endPointHidden.val());

        endPoint.val(tempInput);
        endPointHidden.val(tempHiden);

        return false;
    });

    /*Datepicker departureDate*/
    departureDate.datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0,
        onSelect: function (dateStr) {
            changeDate(dateStr);
        }
    });

    /*Datepicker back date*/
    departureBackDate.datepicker({
        dateFormat: 'dd/mm/yy'
    });

    departureDate.datepicker("setDate", new Date());

    $('#isRound').change(function () {
        if ($(this).is(":checked")) {
            isRound = 1;
            departureBackDate.prop('disabled', false);
            changeDate(departureDate.val());
        } else {
            isRound = 0;
            departureBackDate.prop('disabled', true);
        }
    })
});

/*Change date by departureDate*/
function changeDate(dateStr) {
    if (dateStr === '') {
        return;
    }
    var date_Str = '';
    for (var i = 0; i < 10; i++) {

        if (i == 1 || i == 0) {
            date_Str += dateStr.charAt(i + 3);
        } else if (i == 3 || i == 4) {
            date_Str += dateStr.charAt(i - 3);
        }
        else date_Str += dateStr.charAt(i);
    }
    if (isRound == 1) {
        departureBackDate.datepicker("option", {
            minDate: new Date(date_Str)
        });
        departureBackDate.val(dateStr);
    }
}