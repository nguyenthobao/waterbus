$(document).ready(function() {
    var isRoundWaterBus = false;
    var numberTicket = 1;
    var startPoint = $('#bookingWaterBus #startPoint');
    var endPoint = $('#bookingWaterBus #endPoint');
    var depatureDate = $('#bookingWaterBus #depatureDate');
    var returnDate = $('#bookingWaterBus #returnDate');
    var vehicleType = $('#bookingWaterBus #vehicleType');

    var pricesOneway;

    var pricesReturn;

    var ticketHtml = '';
    var totalMoney = 0;
    var totalMoneyOneway = 0;
    var totalMoneyReturn = 0;
    var promotionPriceOneway = 0;
    var promotionPriceReturn = 0;

    $('#bookingWaterBus #numberTicket').val(numberTicket + " vé");
    $('#bookingWaterBus #isRound').change(function () {
        if($(this).is(":checked")){
            isRoundWaterBus = true;
            $('#bookingWaterBus #divStartPoint').removeClass('col-12');
            $('#bookingWaterBus #divStartPoint').addClass('col-6');
            $('#bookingWaterBus #divEndPoint').show();
        } else {
            isRoundWaterBus = false;
            $('#bookingWaterBus #divEndPoint').hide();
            $('#bookingWaterBus #divStartPoint').removeClass('col-6');
            $('#bookingWaterBus #divStartPoint').addClass('col-12');
        }
    });

    $('#bookingWaterBus #depatureDate').datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0,
        onSelect: function (dateStr) {
            changeDate(dateStr, '#bookingWaterBus #returnDate');
        }
    }).datepicker("setDate", new Date());

    $('#bookingWaterBus #returnDate').datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0
    }).datepicker("setDate", new Date());

    /*Lay du lieu diem*/
    $.ajax({
        type: 'POST',
        url: 'https://dobody-anvui.appspot.com/point/get_province_and_point',
        dataType: "json",
        data: JSON.stringify({companyId: systemId}),
        success: function (data) {
            listDistrict = data.results.result[0].listDistrict;

            /*Start point*/
            $.each(listDistrict, function (k, v) {
                startPoint.append("<option data-lat='" + v.latitude + "' data-long='" + v.longitude + "' value='" + v.districtId + "'>" + v.districtName + "</option>");
            });

            $.each(listDistrict.reverse(), function (k, v) {
                endPoint.append("<option data-lat='" + v.latitude + "' data-long='" + v.longitude + "' value='" + v.districtId + "'>" + v.districtName + "</option>");
            });
        }
    });
    
    $('#bookingWaterBus #upTicket').click(function () {
        numberTicket++;
        $('#bookingWaterBus #numberTicket').val(numberTicket + " vé");
    });

    $('#bookingWaterBus  #downTicket').click(function () {
        if(numberTicket > 1) {
            numberTicket--;
        }
        $('#bookingWaterBus #numberTicket').val(numberTicket + " vé");
    });

    /*Ẩn các điểm đã chọn của điểm đầu điểm cuối để không tròng nhau*/
    startPoint.change(function(){
        var id = $(this).val();
        $("#bookingWaterBus #endPoint option").show();
        $("#bookingWaterBus #endPoint option[value="+id+"]").hide();

        lat = $(this).find(':selected').data('lat');
        long = $(this).find(':selected').data('long');

        pointName = $(this).find(':selected').text();

        initStartMarker(lat, long, pointName)

    });

    endPoint.change(function(){
        var id = $(this).val();
        $("#bookingWaterBus #startPoint option").show();
        $("#bookingWaterBus #startPoint option[value="+id+"]").hide();

        lat = $(this).find(':selected').data('lat');
        long = $(this).find(':selected').data('long');

        pointName = $(this).find(':selected').text();

        initEndMarker(lat, long, pointName)
    });

    /*Tìm kiếm lịch chạy*/
    $('#seachWaterbus').click(function () {
        if (startPoint.val() === null) {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Chưa chọn bến đi',
            });
            return false;
        }

        if (endPoint.val() === null) {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Chưa chọn bến đến',
            });
            return false;
        }

        if(depatureDate.val() === "") {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Chưa chọn ngày đi',
            });
            return false;
        }
        getSchedule(startPoint, endPoint, vehicleType, depatureDate, false);

        if(isRoundWaterBus) {
            $('#bookingWaterBus .schedule-list').removeClass('col-12');
            $('#bookingWaterBus .schedule-list').addClass('col-6');
            $('#bookingWaterBus .schedule-list-return').show();
            $('.title-round').show();
            getSchedule(endPoint, startPoint, vehicleType, returnDate, true);
        } else {
            $('#bookingWaterBus .schedule-list-return').hide();
            $('#bookingWaterBus .schedule-list').removeClass('col-6');
            $('#bookingWaterBus .schedule-list').addClass('col-12');
            $('.title-round').hide();
        }
    });

    /*Lấy danh sách các chuyến*/
    function getSchedule(startPoint, endPoint, vehicleType, date, isBack, startTime) {
        var dateAr = date.val().split('/');
        var newDate = dateAr[0] + '-' + dateAr[1] + '-' + dateAr[2];

        var startPointName = splitPointName(startPoint.find(':selected').text());
        var endPointName = splitPointName(endPoint.find(':selected').text());

        var routeName = startPointName + " - " + endPointName;

        if(!isBack){
            $('.route-name').text(routeName);
        }

        $('#bookingWaterBus .booing-form').hide(300);
        $('#bookingWaterBus .list-schedule').show(300);

        if(isBack){
            $('.schedule-list-return').html('<div class="loading"></div>');
        } else {
            $('.schedule-list').html('<div class="loading"></div>');
        }
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
                // buildSchedulListOneWay(result);
                if(isBack){
                    buildSchedulListReturn(result, startTime);
                } else {
                    buildSchedulListOneWay(result);
                }
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

    /*Chọn chuyến đi*/
    $('body').on('click', '#bookingWaterBus .schedule-item', function () {
        var getInPoint = $(this).data('getinpoint');
        var startTime = $(this).data('starttime');
        var tripStatus = $(this).data('tripstatus');
        var ticketPrice = $(this).data('ticketprice');
        var totalEmptyTicket = $(this).data('numberticket');
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
        }
        else {
            $('#bookingWaterBus .schedule-item').removeClass('selected-schedule');
            $(this).addClass('selected-schedule');

            ticketHtml = '';
            ticketHtml = buildTicket(numberTicket, ticketPrice, false);

            $('#bookingWaterBus .ticket-info-list').html(ticketHtml);

            if(isRoundWaterBus) {
                getSchedule(endPoint, startPoint, vehicleType, returnDate, true, startTime);
            }
        }

        $('.phoneNumber').on('keypress keyup blur', function () {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

    });

    /*Chọn chuyến về*/
    $('body').on('click', '#bookingWaterBus .schedule-item-return', function () {
        var getInPoint = $(this).data('getinpoint');
        var startTime = $(this).data('starttime');
        var tripStatus = $(this).data('tripstatus');
        var ticketPrice = $(this).data('ticketprice');
        var totalEmptyTicket = $(this).data('numberticket');

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
        }
        else {
            $('#bookingWaterBus .schedule-item-return').removeClass('selected-schedule');
            $(this).addClass('selected-schedule');

            var ticketHtmlReturn = buildTicket(numberTicket, ticketPrice, true);
            ticketHtml += ticketHtmlReturn;

            $('#bookingWaterBus .ticket-info-list').html(ticketHtml);
        }

        $('.phoneNumber').on('keypress keyup blur', function () {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });

    });

    /*Back trở lại chọn option*/
    $('.booing-form .backScreen').click(function () {
        $('.booking').hide(300);
        $('#selectOption').show();
        return false;
    });

    /*Back trở lại chọn điểm đi điểm đến*/
    $('.list-schedule .backScreen').click(function () {
        $('#bookingWaterBus .list-schedule').hide(300);
        $('#bookingWaterBus .booing-form').show(300);
        return false;
    });

    /*Back lại chọn chuyến*/
    $('.ticket-info .backScreen').click(function () {
        $('#bookingWaterBus .ticket-info').hide(300);
        $('#bookingWaterBus .list-schedule').show(300);
        return false;
    });

    /*Tiếp tục thanh toán*/
    $('#bookingWaterBus .btnNext').click(function () {
        var selectedOneway = $('.schedule-list .selected-schedule').length;
        var selectedReturn = $('.schedule-list-return .selected-schedule').length;

        if(!selectedOneway) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa chọn chuyến đi',
            });

            return false;
        }

        if(isRoundWaterBus && !selectedReturn) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa chọn chuyến về',
            });

            return false;
        }

        getTotalMoney();

        $('#bookingWaterBus .list-schedule').hide(300);
        $('#bookingWaterBus .ticket-info').show(300);
    });

    /*Tính tổng tiền*/
    function getTotalMoney() {
        pricesOneway = $("#bookingWaterBus #ticketOnewayInfo .price").map(function() {
            return $(this).val();
        }).get();

        pricesReturn = $("#bookingWaterBus #ticketReturnInfo .price").map(function() {
            return $(this).val();
        }).get();

        totalMoneyOneway = 0;
        $.each(pricesOneway, function (k, v) {
            totalMoneyOneway += parseInt(v);
        });

        totalMoneyReturn = 0;
        $.each(pricesReturn, function (k, v) {
            totalMoneyReturn += parseInt(v);
        });

        totalMoney = (totalMoneyOneway - promotionPriceOneway) + (totalMoneyReturn - promotionPriceReturn);

        $('#bookingWaterBus .total-money').val(totalMoney.format() + ' VNĐ');
    }

    /*Thanh toán*/
    $('#bookingWaterBus .payment').click(function () {

        var listFullNameOneWay = $("#bookingWaterBus #ticketOnewayInfo .fullname").map(function() {
            return $(this).val();
        }).get();

        var listPhoneOneway = $("#bookingWaterBus #ticketOnewayInfo .phone").map(function() {
            return $(this).val();
        }).get();

        if(listFullNameOneWay[0] === '') {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa nhập họ tên',
            });
        }

        if(listPhoneOneway[0] === '') {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa nhập số điện thoại',
            });
        }

        var listOptionData = '[';
        var listOption = {};
        for ( var i = 0 ; i < numberTicket ; i++ ){
            listOption['paymentTicketPrice'] = pricesOneway[i];
            listOption['phoneNumber'] = listPhoneOneway[i];
            listOption['originalPrice'] = pricesOneway[i];
            listOption['seatId'] = '';
            listOption['priceInsurance'] = 0;
            listOption['extraPrice'] = 0;
            listOption['ticketPrice'] = pricesOneway[i];
            listOption['isAdult'] = true;
            listOption['fullName'] = listFullNameOneWay[i];
            listOption['surcharge'] = 0;
            listOption['priceMeal'] = -1;
            listOption['agencyPrice'] = pricesOneway[i];
            listOption['totalPrice'] = pricesOneway[i];
            if(i === (numberTicket -1)){
                listOptionData += JSON.stringify(listOption);
            } else {
                listOptionData += JSON.stringify(listOption) + ',';
            }
        }
        listOptionData += ']';

        console.log('listOptionData' ,listOptionData);
    });
    
    function payment() {
        
    }
});

/*Show alert khi chọn miễn phí*/
$('body').on('click', '#bookingWaterBus .ticket-free', function () {
    $.alert({
        title: 'Thông báo',
        content: 'Dành cho người già từ 70 tuổi và trẻ em dưới 1m. Vé miễn phí chỉ áp dụng khi giao dịch tại các ga tàu thủy',
        buttons: {
            ok: {
                text: 'Đồng ý'
            }
        }
    });
});
