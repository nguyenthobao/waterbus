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

    /*Back trở lại chọn điểm đi điểm đến*/
    $('.list-schedule .backScreen').click(function () {
        $('#bookingWaterTaxi .list-schedule').hide(300);
        $('#bookingWaterTaxi .booing-form').show(300);
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
                buildSchedulList(result);
            }
        });
    }

    function buildSchedulList(scheduleData) {
        var scheduleList = '';

        $.each(scheduleData, function (k, v) {
            scheduleList += '<div class="col-12 margin-schedule">';
            scheduleList += '<div class="row schedule-item" ' +
                'data-ticketprice="' + v.ticketPrice + '" ' +
                'data-openprice="' + v.openPrice + '" ' +
                'data-getinpoint="' + v.getInPointId + '" ' +
                'data-getoffpoint="' + v.getOffPointId + '" ' +
                'data-getintime="' + v.getInTime + '" ' +
                'data-getofftime="' + v.getOffTime + '" ' +
                'data-startdate="' + v.startDate + '" ' +
                'data-scheduleid="' + v.scheduleId + '" ' +
                'data-tripid="' + v.tripId + '" ' +
                'data-tripstatus="' + v.tripStatus + '" ' +
                'data-numberticket="' + v.totalEmptySeat + '" ' +
                'data-totalseat="' + v.totalSeat + '" ' +
                'data-starttime="' + v.startTimeUnix + '">';
            scheduleList += '<div class="col-8">';
            scheduleList += '<div class="schedule-date">' + getFormattedDate(v.startDate, 'dM') + '</div>';
            if(v.startTimeUnix < Date.now() || v.tripStatus === 2) {
                scheduleList += '<div class="schedule-status">Đã khởi hành</div>';
            } else {
                scheduleList += '<div class="totalEmptySeat">Còn trống ' + v.totalEmptySeat + ' vé</div>';
            }
            scheduleList += '</div>';
            scheduleList += '<div class="col-4">';
            scheduleList += '<div class="schedule-time pull-right">' + getFormattedDate(v.startTimeUnix, 'time') + '</div>';
            scheduleList += '</div>';
            scheduleList += '</div>';
            scheduleList += '</div>';
        });
        $('.schedule-list').html(scheduleList);
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

    /*Chọn chuyến đi*/
    $('body').on('click', '#bookingWaterTaxi .schedule-item', function () {
        var getInPoint = $(this).data('getinpoint');
        var getOffPoint = $(this).data('getoffpoint');
        var getInTime = $(this).data('getintime');
        var getOffTime = $(this).data('getofftime');
        var startTime = $(this).data('starttime');
        var tripStatus = $(this).data('tripstatus');
        var scheduleId = $(this).data('scheduleid');
        var ticketPrice = $(this).data('ticketprice');
        var openPrice = $(this).data('openprice');
        var tripId = $(this).data('tripid');
        var totalEmptyTicket = $(this).data('numberticket');
        var totalSeat = $(this).data('totalseat');
        var startDate = $(this).data('startdate');

        if(startTime < Date.now() || tripStatus === 2) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Vé đã bán hết, vui lòng chọn chuyến khác hoặc chọn một ngày khởi hành khác',
            });
        }
        else if(numberTicket > totalEmptyTicket) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Số vé bán đặt nhiều hơn số vé hiện có',
            });
        } else {
            $('#bookingWaterTaxi .schedule-item').removeClass('selected-schedule');
            $(this).addClass('selected-schedule');

            ticketHtml = '';

            $('#bookingWaterTaxi .ticket-info-list').html(ticketHtml);
        }

        $('.phoneNumber').on('keypress keyup blur', function () {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

    });

    /*Tiếp tục thanh toán*/
    $('#bookingWaterTaxi .btnNext').click(function () {
        var selected = $('.schedule-list .selected-schedule').length;

        if(!selected) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa chọn chuyến đi',
            });

            return false;
        }

        $('#bookingWaterTaxi .list-schedule').hide(300);
        $('#bookingWaterTaxi .ticket-info').show(300);
    });

    /*Back lại chọn chuyến*/
    $('.ticket-info .backScreen').click(function () {
        $('#bookingWaterTaxi .ticket-info').hide(300);
        $('#bookingWaterTaxi .list-schedule').show(300);
        return false;
    });

});