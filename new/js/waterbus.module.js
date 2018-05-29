$(document).ready(function() {
    var isRoundWaterBus = false;
    var numberTicket = 1;
    var startPoint = $('#bookingWaterBus #startPoint');
    var endPoint = $('#bookingWaterBus #endPoint');
    var depatureDate = $('#bookingWaterBus #depatureDate');
    var returnDate = $('#bookingWaterBus #returnDate');
    var vehicleType = $('#bookingWaterBus #vehicleType');

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
    function getSchedule(startPoint, endPoint, vehicleType, date, isBack) {
        var dateAr = date.val().split('/');
        var newDate = dateAr[0] + '-' + dateAr[1] + '-' + dateAr[2];

        var startPointName = splitPointName(startPoint.find(':selected').text());
        var endPointName = splitPointName(endPoint.find(':selected').text());

        var routeName = startPointName + " - " + endPointName;

        $('.route-name').text(routeName);

        $('#bookingWaterBus .booing-form').hide(300);
        $('#bookingWaterBus .list-schedule').show(300);
        $('.schedule-list').html('<div class="loading"></div>');
        $('.schedule-list-return').html('<div class="loading"></div>');
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
                console.log(result);
                buildSchedulListOneWay(result);
                if(isBack){
                    buildSchedulListReturn(result);
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
        if(startTime < Date.now() || tripStatus === 2) {
            $.alert({
                title: 'Thông báo!',
                type: 'orange',
                typeAnimated: true,
                content: 'Vé đã bán hết, vui lòng chọn chuyến khác hoặc chọn một ngày khởi hành khác',
            });
        } else {
            $('#bookingWaterBus .schedule-item').removeClass('selected-schedule');
            $(this).addClass('selected-schedule');
        }

    });

    /*Back trở lại chọn option*/
    $('.booing-form .backScreen').click(function () {
        $('.booking').hide(300);
        $('#selectOption').show();
        return false;
    });

    $('.list-schedule .backScreen').click(function () {
        $('#bookingWaterBus .list-schedule').hide(300);
        $('#bookingWaterBus .booing-form').show(300);
        return false;
    });
});
