var isRound = 0;
var departureDate = $('#departureDate');
var departureBackDate = $('#departureBackDate');
var startPoint = $('#startPoint');
var endPoint = $('#endPoint');
var startPointHidden = $('#startPointHidden');
var endPointHidden = $('#endPointHidden');

var systemId = $("base").attr("id");

$(document).ready(function () {
    /*If has session storage, fill to input*/
    if(sessionStorage.length > 0) {
        startPoint.val(sessionStorage.startPoint);
        startPointHidden.val(sessionStorage.startPointHidden);

        endPoint.val(sessionStorage.endPoint);
        endPointHidden.val(sessionStorage.endPointHidden);

        // departureDate.datepicker("setDate", sessionStorage.departureDate);
        $('.back-to-home').show();
    } else {
        $('.back-to-home').hide();
    }

    /*Get all point*/
    $.ajax({
        type: 'POST',
        url: 'https://dobody-anvui.appspot.com/route/getListWayAvailable',
        dataType: "json",
        data: JSON.stringify({companyId: systemId}),
        success: function (data) {
            listWay = data.results.listWay;
            mergeListWay = [];
            count = 0;
            $.each(listWay, function (key, val) {
                $.each(val, function (k, v) {
                    mergeListWay[count] = v;
                    count++;
                });
            });
            makeQuickRoute(mergeListWay);
        }
    });

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

    /*Switch start and endPoint*/
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
    });

    $('#type').change(function () {
        isRound = $(this).val();
        if (isRound == 1) {
            departureBackDate.prop('disabled', false);
            changeDate(departureDate.val());
        } else {
            departureBackDate.prop('disabled', true);
        }
    });

    /*Build number seats*/
    for (i = 1; i <= 8; i++) {
        $('#seats').append('<option value="' + i + '">' + i + '</option>');
    }

    $('.route-detail').click(function () {
        $('#routeDetailModal').modal('show');

        return false;
    });

    /*Redirect booking search result*/
    $('#search-trip').click(function () {

        if (typeof(Storage) !== "undefined") {
            /*Save route info to to sessionStorage*/
            sessionStorage.startPoint = startPoint.val();
            sessionStorage.startPointHidden = startPointHidden.val();
            sessionStorage.endPoint = endPoint.val();
            sessionStorage.endPointHidden = endPointHidden.val();
            sessionStorage.departureDate = departureDate.val();
            sessionStorage.departureBackDate = departureBackDate.val();
            sessionStorage.seats = $('#seats').val();
            sessionStorage.isRound = isRound;
            sessionStorage.step = 1;

            window.location.replace("booking.html");
        } else {
            alert('Phiên bản trình duyệt quá cũ, vui lòng nâng cấp để sử dụng đủ các chức năng');
        }


    });

    /*Event back button*/
    $('.back-to-home').click(function () {
        if(sessionStorage.step == 1) {
            sessionStorage.clear();
            window.location.replace("index.html");
        } else {
            alert('AAA');
        }

        return false;
    });

});

$('body').on('click', '.selectRoute', function () {
    var inPointName = $(this).data('inpointname');
    var inPointId = $(this).data('inpoint');
    var offPointName = $(this).data('offpointname');
    var offPointId = $(this).data('offpoint');

    startPoint.val(inPointName);
    startPointHidden.val(inPointId);
    endPoint.val(offPointName);
    endPointHidden.val(offPointId);

    $('html, body').animate({
        scrollTop: $(".masthead").offset().top
    }, 2000);

    return false;
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

/*Make quick route select*/
function makeQuickRoute(data) {
    html = '';
    $.each(data, function (key, item) {
        html += '<div class="block col-12 col-xl-6 col-lg-12">';
        html += '<div class="from">';
        html += '<span class="city">';
        html += item.inPoint.pointName;
        html += '</span>';
        html += '</div>';
        html += '<div class="arrow"></div>';
        html += '<div class="to">';
        html += '<span class="city">';
        html += item.offPoint.pointName;
        html += '</span>';
        html += '</div>';
        html += '<a class="selectRoute btn" ' +
            'data-inpointname="' + item.inPoint.pointName + '" ' +
            'data-inpoint="' + item.inPoint.pointId + '" ' +
            'data-offpointname="' + item.offPoint.pointName + '" ' +
            'data-offpoint="' + item.offPoint.pointId + '" href="#">Chọn</a>'
        html += '</div>';
    });
    $('.content-route').html(html);
}