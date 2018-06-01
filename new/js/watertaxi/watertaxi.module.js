$(document).ready(function() {
    var startPoint = $('#bookingWaterTaxi #startPoint');
    var endPoint = $('#bookingWaterTaxi #endPoint');

    var numberTicket = 1;
    var promotionPrice = 0;

    var prices;
    var totalMoney = 0;

    var depatureDate = $('#bookingWaterTaxi #depatureDateTaxi');

    var vehicleType = $('#bookingWaterTaxi #vehicleType');

    depatureDate.datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0
    }).datepicker("setDate", new Date());

    $('#bookingWaterTaxi #numberTicket').val(numberTicket + " vé");

    $('#bookingWaterTaxi #upTicket').click(function () {
        numberTicket++;
        $('#bookingWaterTaxi #numberTicket').val(numberTicket + " vé");
    });

    $('#bookingWaterTaxi #downTicket').click(function () {
        if(numberTicket > 1) {
            numberTicket--;
        }
        $('#bookingWaterTaxi #numberTicket').val(numberTicket + " vé");
    });

    /*Ẩn các điểm đã chọn của điểm đầu điểm cuối để không trùng nhau*/
    startPoint.change(function(){
        var id = $(this).val();
        $("#bookingWaterTaxi #endPoint option").show();
        $("#bookingWaterTaxi #endPoint option[value="+id+"]").hide();

        var index = $("#bookingWaterTaxi #startPoint").prop('selectedIndex');

        $("#bookingWaterTaxi #endPoint").prop('selectedIndex', index);

        lat = $(this).find(':selected').data('lat');
        long = $(this).find(':selected').data('long');

        pointName = $(this).find(':selected').text();

        initStartMarker(lat, long, pointName);

        var endPointSelected = $("#bookingWaterTaxi #endPoint").find(":selected");

        pointNameEnd = endPointSelected.text();
        latEnd = endPointSelected.data('lat');
        longEnd = endPointSelected.data('long');

        initEndMarker(latEnd, longEnd, pointNameEnd);
    });
    
    $('#seachWaterTaxi').click(function () {
        $.alert({
            title: 'Thông báo',
            type: 'green',
            typeAnimated: true,
            content: 'Bạn đang sử dụng dịch vụ Saigon Watertaxi. Phí mở cửa là 270.000 VNĐ/lượt cho nhóm tối đa 6 người. ' +
            'Từ người tiếp theo, giá vé là 60.000 VNĐ/người/lượt',
            buttons: {
                ok: {
                    text: 'Đồng ý'
                }
            },
            onClose: function () {
                getSchedule(startPoint, endPoint, vehicleType, depatureDate);
            }
        });
        return false;
    });

    /*Lấy danh sách các chuyến*/
    function getSchedule(startPoint, endPoint, vehicleType, date) {
        var dateAr = date.val().split('/');
        var newDate = dateAr[0] + '-' + dateAr[1] + '-' + dateAr[2];

        var startPointName = splitPointName(startPoint.find(':selected').text());
        var endPointName = splitPointName(endPoint.find(':selected').text());

        var routeName = startPointName + " - " + endPointName;

        $('.route-name').text(routeName);

        $('#bookingWaterTaxi .booing-form').hide(300);
        $('#bookingWaterTaxi .list-schedule').show(300);

        $('.schedule-list').html('<div class="loading"></div>');

        $.ajax({
            type: "POST",
            url: "https://anvui.vn/listSchedule2",
            data: {
                startPoint: startPoint.val(),
                endPoint: endPoint.val(),
                date: newDate,
                companyId: systemId,
                vehicleTypeId: vehicleType.val(),
                page: 0,
                count: 1000
            },
            success: function (result) {
                buildSchedulListOneWay(result);
            }
        });
    }

    /*Lấy tên bến tàu*/
    function splitPointName(pointName) {
        var res = pointName.split(" ");
        var newName = '';
        for (i = 3; i < res.length; i++) {
            newName += res[i] + " ";
        }
        return newName;
    }

});