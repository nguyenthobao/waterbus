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
                'data-maxguestopen="' + v.maxGuestForOpenPrice + '" ' +
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
        var maxGuestForOpenPrice = $(this).data('maxguestopen');

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

            var ticketHtml = buildTicketTaxi(numberTicket, ticketPrice, tripId, scheduleId, getInPoint, getOffPoint, getInTime, getOffTime, startDate, totalEmptyTicket, totalSeat, openPrice, maxGuestForOpenPrice);

            $('#bookingWaterTaxi .ticket-info-list').html(ticketHtml);
        }

        $('.phoneNumber').on('keypress keyup blur', function () {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

    });
    
    function buildTicketTaxi(numberTicket, ticketPrice, tripId, scheduleId, getInPoint, getOffPoint, getInTime, getOffTime, startDate, totalEmptyTicket, totalSeat, openPrice, maxGuestForOpenPrice) {
        var ticketHtml = '';
        /*Thong tin khach tren tung ve*/
        ticketHtml = '<div id="ticketOnewayInfo">';
        if(totalEmptyTicket !==  totalSeat) {
            for (var i = 0; i < numberTicket; i++) {
                ticketHtml += '<div class="col-12 margin-ticket">';
                ticketHtml += '<div class="row ticket-info-item">';
                ticketHtml += '<div class="col-12 row no-padding-left no-margin-left-right margin-top10 margin-bottom10">';
                ticketHtml += '<label class="col-4">Họ tên:</label>';
                ticketHtml += '<div class="col-8 no-padding-right">';
                ticketHtml += '<input type="text" class="form-control fullname">';
                ticketHtml += '</div>';
                ticketHtml += '</div>';
                ticketHtml += '<div class="col-12 row no-padding-left no-margin-left-right margin-top10 margin-bottom10">';
                ticketHtml += '<label class="col-4">Số điện thoại:</label>';
                ticketHtml += '<div class="col-8 no-padding-right">';
                ticketHtml += '<input type="text" class="form-control phoneNumber">';
                ticketHtml += '</div>';
                ticketHtml += '</div>';
                ticketHtml += '<div class="col-12 col-centered margin-top10 margin-bottom10">';
                ticketHtml += '<input type="text" value="' + ticketPrice.format() + ' VNĐ" readonly class="form-control text-center ticketPrice">';
                ticketHtml += '</div>';
                ticketHtml += '<input type="hidden" class="price" value="' + ticketPrice + '">';
                ticketHtml += '</div>';
                ticketHtml += '</div>';
            }
        } else {
            /*Có vé trong nhóm mở cửa*/
            var numberTicketGroup = maxGuestForOpenPrice;
            if(numberTicket <= maxGuestForOpenPrice){
                numberTicketGroup = numberTicket;
            }

            var ticketPriceGroup = openPrice/numberTicketGroup;

            for (var i = 0; i < numberTicket; i++) {
                ticketHtml += '<div class="col-12 margin-ticket">';
                ticketHtml += '<div class="row ticket-info-item">';
                ticketHtml += '<div class="col-12 row no-padding-left no-margin-left-right margin-top10 margin-bottom10">';
                ticketHtml += '<label class="col-4">Họ tên:</label>';
                ticketHtml += '<div class="col-8 no-padding-right">';
                ticketHtml += '<input type="text" class="form-control fullname">';
                ticketHtml += '</div>';
                ticketHtml += '</div>';
                ticketHtml += '<div class="col-12 row no-padding-left no-margin-left-right margin-top10 margin-bottom10">';
                ticketHtml += '<label class="col-4">Số điện thoại:</label>';
                ticketHtml += '<div class="col-8 no-padding-right">';
                ticketHtml += '<input type="text" class="form-control phoneNumber">';
                ticketHtml += '</div>';
                ticketHtml += '</div>';

                if(i < numberTicketGroup) {
                    ticketHtml += '<div class="col-12 col-centered margin-top10 margin-bottom10">';
                    ticketHtml += '<input type="text" value="VÉ TRONG NHÓM VÉ MỞ CỬA" readonly class="form-control text-center ticketPrice">';
                    ticketHtml += '</div>';
                    ticketHtml += '<input type="hidden" class="price" value="' + ticketPriceGroup + '">';
                } else {
                    ticketHtml += '<div class="col-12 col-centered margin-top10 margin-bottom10">';
                    ticketHtml += '<input type="text" value="' + ticketPrice.format() + ' VNĐ" readonly class="form-control text-center ticketPrice">';
                    ticketHtml += '</div>';
                    ticketHtml += '<input type="hidden" class="price" value="' + ticketPrice + '">';
                }

                ticketHtml += '</div>';
                ticketHtml += '</div>';
            }

        }

        /*Thong tin chung*/
        ticketHtml += '<div class="col-12 margin-ticket">';
        ticketHtml += '<div class="row customer-info">';
        ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10">';
        ticketHtml += '<label>Số lượng vé</label>';
        ticketHtml += '<input type="text" value="' + numberTicket + '" class="col-12 form-control text-center" readonly>';
        ticketHtml += '</div>';
        ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10">';
        ticketHtml += '<label>Ghi chú</label>';
        ticketHtml += '<input type="text" class="col-12 form-control" placeholder="Ghi chú" id="note">';
        ticketHtml += '</div>';
        ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10 margin-bottom10">';
        ticketHtml += '<label>Email nhận thông tin vé</label>';
        ticketHtml += '<input type="email" placeholder="Email nhận thông tin vé" class="col-12 form-control" id="email">';
        ticketHtml += '</div>';
        /*ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10 margin-bottom10">';
            ticketHtml += '<label>Mã khuyến mại</label>';
            ticketHtml += '<input type="text" placeholder="Mã khuyến mại" class="col-12 form-control" id="promotion">';
        ticketHtml += '</div>';*/
        ticketHtml += '<input type="hidden" value="' + tripId + '" id="tripId">';
        ticketHtml += '<input type="hidden" value="' + scheduleId + '" id="scheduleId">';
        ticketHtml += '<input type="hidden" value="' + getInPoint + '" id="getInPointId">';
        ticketHtml += '<input type="hidden" value="' + getOffPoint + '" id="getOffPointId">';
        ticketHtml += '<input type="hidden" value="' + getInTime + '" id="getInTimePlan">';
        ticketHtml += '<input type="hidden" value="' + getOffTime + '" id="getOffTimePlan">';
        ticketHtml += '<input type="hidden" value="' + startDate + '" id="startDate">';
        ticketHtml += '</div>';
        ticketHtml += '</div>';

        ticketHtml += '</div>';

        return ticketHtml;
    }

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

        getTotalMoney();

        $('#bookingWaterTaxi .list-schedule').hide(300);
        $('#bookingWaterTaxi .ticket-info').show(300);
    });

    /*Tính tổng tiền*/
    function getTotalMoney() {
        prices = $("#bookingWaterTaxi .ticket-info-list .price").map(function() {
            return $(this).val();
        }).get();

        totalMoneyTicket = 0;
        $.each(prices, function (k, v) {
            totalMoneyTicket += parseInt(v);
        });

        totalMoney = totalMoneyTicket - promotionPrice;

        $('#bookingWaterTaxi .total-money').val(totalMoney.format() + ' VNĐ');
    }

    /*Back lại chọn chuyến*/
    $('.ticket-info .backScreen').click(function () {
        $('#bookingWaterTaxi .ticket-info').hide(300);
        $('#bookingWaterTaxi .list-schedule').show(300);
        return false;
    });

});