$(document).ready(function() {
    var numberTicket = 1;
    var promotionPrice = 0;

    var prices;
    var totalMoney = 0;

    var depatureDate = $('#booingSaigonRiver #depatureDateRiver');

    var vehicleType = $('#booingSaigonRiver #vehicleType');

    depatureDate.datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0
    }).datepicker("setDate", new Date());

    $('#booingSaigonRiver #numberTicket').val(numberTicket + " vé");

    $('#booingSaigonRiver #upTicket').click(function () {
        numberTicket++;
        $('#booingSaigonRiver #numberTicket').val(numberTicket + " vé");
    });

    $('#booingSaigonRiver  #downTicket').click(function () {
        if(numberTicket > 1) {
            numberTicket--;
        }
        $('#booingSaigonRiver #numberTicket').val(numberTicket + " vé");
    });

    $('#seachSaigonRiver').click(function () {
        if(depatureDate.val() === "") {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Chưa chọn ngày đi',
            });
            return false;
        }

        getSchedule(vehicleType, depatureDate);
    });

    /*Back tro lai man hinh chon so luong ve*/
    $('.list-schedule .backScreen').click(function () {
        $('#booingSaigonRiver .list-schedule').hide(300);
        $('#booingSaigonRiver .booing-form').show(300);
        return false;
    });

    /*Back lại chọn chuyến*/
    $('.ticket-info .backScreen').click(function () {
        $('#booingSaigonRiver .ticket-info').hide(300);
        $('#booingSaigonRiver .list-schedule').show(300);
        return false;
    });

    /*Tiếp tục thanh toán*/
    $('#booingSaigonRiver .btnNext').click(function () {
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

        $('#booingSaigonRiver .list-schedule').hide(300);
        $('#booingSaigonRiver .ticket-info').show(300);
    });

    /*Tính tổng tiền*/
    function getTotalMoney() {
        prices = $("#booingSaigonRiver #ticketOnewayInfo .price").map(function() {
            return $(this).val();
        }).get();

        totalMoneyTicket = 0;
        $.each(prices, function (k, v) {
            totalMoneyTicket += parseInt(v);
        });

        totalMoney = totalMoneyTicket - promotionPrice;

        $('#booingSaigonRiver .total-money').val(totalMoney.format() + ' VNĐ');
    }

    /*Lấy danh sách các chuyến*/
    function getSchedule(vehicleType, date) {
        var dateAr = date.val().split('/');
        var newDate = dateAr[0] + '-' + dateAr[1] + '-' + dateAr[2];

        var startPoint = "P03k1Iq7vRvdDS";
        var endPoint = "P03k1IqIku8fXQ";

        $('.schedule-list').html('<div class="loading"></div>');

        $('#booingSaigonRiver .booing-form').hide(300);
        $('#booingSaigonRiver .list-schedule').show(300);

        $.ajax({
            type: "POST",
            url: "https://anvui.vn/listSchedule2",
            data: {
                startPoint: startPoint,
                endPoint: endPoint,
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

    /*Thanh toán*/
    $('#booingSaigonRiver .payment').click(function () {

        var listFullName = $("#booingSaigonRiver #ticketOnewayInfo .fullname").map(function() {
            return $(this).val();
        }).get();

        var listPhone = $("#booingSaigonRiver #ticketOnewayInfo .phoneNumber").map(function() {
            return $(this).val();
        }).get();

        /*Thong tin khach chuyen di*/
        var scheduleId = $("#booingSaigonRiver #ticketOnewayInfo #scheduleId").val();
        var tripId = $("#booingSaigonRiver #ticketOnewayInfo #tripId").val();
        var getInPointId = $("#booingSaigonRiver #ticketOnewayInfo #getInPointId").val();
        var getOffPointId = $("#booingSaigonRiver #ticketOnewayInfo #getOffPointId").val();
        var getInTimePlan = $("#booingSaigonRiver #ticketOnewayInfo #getInTimePlan").val();
        var getOffTimePlan = $("#booingSaigonRiver #ticketOnewayInfo #getOffTimePlan").val();
        var note = $("#booingSaigonRiver #ticketOnewayInfo #note").val();
        var startDate = $("#booingSaigonRiver #ticketOnewayInfo #startDate").val();

        if(listFullName[0] === '') {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa nhập họ tên chuyến đi',
            });
            return false;
        }

        if(listPhone[0] === '') {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Chưa nhập số điện thoại chuyến đi',
            });
            return false;
        }

        var listOptionData = '[';
        var listOption = {};
        for ( var i = 0 ; i < numberTicket ; i++ ){
            listOption['paymentTicketPrice'] = prices[i];
            listOption['phoneNumber'] = listPhone[i];
            listOption['originalPrice'] = prices[i];
            listOption['seatId'] = '';
            listOption['priceInsurance'] = 0;
            listOption['extraPrice'] = 0;
            listOption['ticketPrice'] = prices[i];
            listOption['isAdult'] = true;
            listOption['fullName'] = listFullName[i];
            listOption['surcharge'] = 0;
            listOption['priceMeal'] = -1;
            listOption['agencyPrice'] = prices[i];
            listOption['totalPrice'] = prices[i];
            if(i === (numberTicket -1)){
                listOptionData += JSON.stringify(listOption);
            } else {
                listOptionData += JSON.stringify(listOption) + ',';
            }
        }
        listOptionData += ']';

        dataListOption = {
            "startDate": startDate,
            "scheduleId": scheduleId,
            "paymentTicketPrice": totalMoney,
            "packageName": "web",
            "tripId": tripId,
            "timeZone": "7",
            "originalTicketPrice": totalMoney,
            "numberOfAdults": numberTicket,
            "getOffPointId": getOffPointId,
            "phoneNumber": listPhone[0],
            "numberOfChildren": "0",
            "description": note,
            "getOffTimePlan": getOffTimePlan,
            "listOption": JSON.parse(listOptionData),
            "getInTimePlan": getInTimePlan,
            "fullName": listFullName[0],
            "paidMoney":"0",
            "companyId": systemId,
            "getInPointId": getInPointId,
            "agencyPrice": totalMoney
        };
        payment(dataListOption);
    });

    $('body').on('click', '#booingSaigonRiver .schedule-item', function () {
        var getInPoint = $(this).data('getinpoint');
        var getOffPoint = $(this).data('getoffpoint');
        var getInTime = $(this).data('getintime');
        var getOffTime = $(this).data('getofftime');
        var startTime = $(this).data('starttime');
        var tripStatus = $(this).data('tripstatus');
        var scheduleId = $(this).data('scheduleid');
        var ticketPrice = $(this).data('ticketprice');
        var tripId = $(this).data('tripid');
        var totalEmptyTicket = $(this).data('numberticket');
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
            $('#booingSaigonRiver .schedule-item').removeClass('selected-schedule');
            $(this).addClass('selected-schedule');

            ticketHtml = '';
            ticketHtml = buildTicket(numberTicket, ticketPrice, tripId, scheduleId, getInPoint, getOffPoint, getInTime, getOffTime, startDate, false, false);

            $('#booingSaigonRiver .ticket-info-list').html(ticketHtml);
        }
    });

    function payment(dataPayment) {
        $.ajax({
            type: "POST",
            url: "https://anvui.vn/createnoseatid",
            data: dataPayment,
            success: function (result) {

                if(result.code === 200) {
                    $.dialog({
                        title: 'Thông báo!',
                        content: 'Hệ thống đang chuyển sang cổng thanh toán, vui lòng đợi trong giây lát...',
                        onClose: function (e) {
                            e.preventDefault();
                        }
                    });
                    epayPayment(result.results.ticketId, dataPayment.phoneNumber);

                } else {
                    $.alert({
                        title: 'Thông báo!',
                        type: 'red',
                        typeAnimated: true,
                        content: 'Đã có lỗi xảy ra, vui lòng thử lại',
                    });
                }
            }
        });
    }

    function epayPayment(ticketId, phoneNumber) {
        $.ajax({
            type: 'POST',
            url: 'https://dobody-anvui.appspot.com/ePay/',
            dataType: 'json',
            data: JSON.stringify({
                ticketId: ticketId,
                paymentType: 1,
                packageName: 'web',
                phoneNumber: phoneNumber,
            }),
            success: function (data) {
                url = data.results.redirect;
                setTimeout(function () {
                    window.location.href = url;
                }, 4000);
            }
        });
    }
});