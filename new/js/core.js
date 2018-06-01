var isRound = 0;
var systemId = $("base").attr("id");

$(document).ready(function() {
    $('#active-waterbus').click(function () {
        $('#bookingWaterBus').show(500);
        $('#selectOption').hide();
        return false;
    });

    /*$('.datepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0
    }).datepicker("setDate", new Date());*/

});

$(".owl-carousel").owlCarousel({
    loop: false,
    responsiveClass:true,
    nav: false,
    dots: false,
    responsive:{
        0:{
            items: 2
        },
        400:{
            items: 3
        },
        600:{
            items: 4
        },
        1000:{
            items: 6
        }
    }
});

function buildSchedulListOneWay(scheduleData) {
    var scheduleList = '';

    $.each(scheduleData, function (k, v) {
        scheduleList += '<div class="col-12 margin-schedule">';
            scheduleList += '<div class="row schedule-item" ' +
                'data-ticketprice="' + v.ticketPrice + '" ' +
                'data-getinpoint="' + v.getInPointId + '" ' +
                'data-getoffpoint="' + v.getOffPointId + '" ' +
                'data-getintime="' + v.getInTime + '" ' +
                'data-getofftime="' + v.getOffTime + '" ' +
                'data-startdate="' + v.startDate + '" ' +
                'data-scheduleid="' + v.scheduleId + '" ' +
                'data-tripid="' + v.tripId + '" ' +
                'data-tripstatus="' + v.tripStatus + '" ' +
                'data-numberticket="' + v.totalEmptySeat + '" ' +
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

function buildSchedulListReturn(scheduleData, startTime) {
    var scheduleList = '';
    $.each(scheduleData, function (k, v) {
        if(startTime === undefined) {
            scheduleList += '<div class="col-12 margin-schedule">';
            scheduleList += '<div class="row schedule-item-return" ' +
                'data-ticketprice="' + v.ticketPrice + '" ' +
                'data-getinpoint="' + v.getInPointId + '" ' +
                'data-getoffpoint="' + v.getOffPointId + '" ' +
                'data-getintime="' + v.getInTime + '" ' +
                'data-getofftime="' + v.getOffTime + '" ' +
                'data-startdate="' + v.startDate + '" ' +
                'data-scheduleid="' + v.scheduleId + '" ' +
                'data-tripid="' + v.tripId + '" ' +
                'data-tripstatus="' + v.tripStatus + '" ' +
                'data-numberticket="' + v.totalEmptySeat + '" ' +
                'data-starttime="' + v.startTimeUnix + '">';
            scheduleList += '<div class="col-8">';
            scheduleList += '<div class="schedule-date">' + getFormattedDate(v.startDate, 'dM') + '</div>';
            if (v.startTimeUnix < Date.now() || v.tripStatus === 2) {
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
        } else if(v.startTimeUnix > startTime) {
            scheduleList += '<div class="col-12 margin-schedule">';
            scheduleList += '<div class="row schedule-item-return" ' +
                'data-ticketprice="' + v.ticketPrice + '" ' +
                'data-getinpoint="' + v.getInPointId + '" ' +
                'data-getoffpoint="' + v.getOffPointId + '" ' +
                'data-getintime="' + v.getInTime + '" ' +
                'data-getofftime="' + v.getOffTime + '" ' +
                'data-startdate="' + v.startDate + '" ' +
                'data-scheduleid="' + v.scheduleId + '" ' +
                'data-tripid="' + v.tripId + '" ' +
                'data-tripstatus="' + v.tripStatus + '" ' +
                'data-numberticket="' + v.totalEmptySeat + '" ' +
                'data-starttime="' + v.startTimeUnix + '">';
            scheduleList += '<div class="col-8">';
            scheduleList += '<div class="schedule-date">' + getFormattedDate(v.startDate, 'dM') + '</div>';
            if (v.startTimeUnix < Date.now() || v.tripStatus === 2) {
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
        }
    });
    $('.schedule-list-return').html(scheduleList);
}

function getFormattedDate(unix_timestamp, methor) {
    var date = new Date(unix_timestamp);
    str = '';
    if (methor === 'time') {
        str = $.format.date(date.getTime(), 'HH:mm')
    } else if(methor === 'dM') {
        str = $.format.date(date.getTime(), 'dd/MM')
    } else if(methor === 'date') {
        str = $.format.date(date.getTime(), 'dd/MM/yyyy')
    } else {
        str = $.format.date(date.getTime(), 'HH:mm, dd/MM/yyyy')
    }

    return str;
}

function buildTicket(numberTicket, price, tripId, scheduleId, getInPointId, getOffPointId, getInTimePlan, getOffTimePlan, startDate, isRound) {
    var ticketHtml = '';
    if(!isRound) {
        ticketHtml = '<div id="ticketOnewayInfo">';
        ticketHtml += '<h6 class="ticket-type">Lượt đi</h6>';
    }
    else {
        ticketHtml = '<div id="ticketReturnInfo">';
        ticketHtml += '<h6 class="ticket-type">Lượt về</h6>';
    }

    /*Thong tin khach tren tung ve*/
    for (var i = 0; i < numberTicket; i++) {
        ticketHtml += '<div class="col-12 margin-ticket">';
            ticketHtml += '<div class="row ticket-info-item">';
                ticketHtml += '<div class="col-6 margin-top10">';
                    ticketHtml += '<div class="pretty p-icon p-smooth p-locked">';
                        ticketHtml += '<input type="checkbox" checked/>';
                        ticketHtml += '<div class="state p-danger">';
                            ticketHtml += '<i class="icon fa fa-check"></i><label>' + price.format() + ' VNĐ</label>';
                        ticketHtml += '</div>';
                    ticketHtml += '</div>';
                ticketHtml += '</div>';
                ticketHtml += '<div class="col-6 margin-top10 ticket-free">';
                    ticketHtml += '<div class="pretty p-icon p-smooth p-locked">';
                        ticketHtml += '<input type="checkbox"/>';
                        ticketHtml += '<div class="state p-danger">';
                            ticketHtml += '<i class="icon fa fa-check"></i>';
                            ticketHtml += '<label>Miễn phí</label>';
                        ticketHtml += '</div>';
                    ticketHtml += '</div>';
                ticketHtml += '</div>';
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
                    ticketHtml += '<input type="text" value="' + price.format() + ' VNĐ" readonly class="form-control text-center ticketPrice">';
                ticketHtml += '</div>';
                ticketHtml += '<input type="hidden" class="price" value="' + price + '">';
            ticketHtml += '</div>';
        ticketHtml += '</div>';
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
            ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10">';
                ticketHtml += '<label>Email nhận thông tin vé</label>';
                ticketHtml += '<input type="email" placeholder="Email nhận thông tin vé" class="col-12 form-control" id="email">';
            ticketHtml += '</div>';
            ticketHtml += '<div class="col-12 row no-margin-left-right margin-top10 margin-bottom10">';
                ticketHtml += '<label>Mã khuyến mại</label>';
                ticketHtml += '<input type="text" placeholder="Mã khuyến mại" class="col-12 form-control" id="promotion">';
            ticketHtml += '</div>';
            ticketHtml += '<input type="hidden" value="' + tripId + '" id="tripId">';
            ticketHtml += '<input type="hidden" value="' + scheduleId + '" id="scheduleId">';
            ticketHtml += '<input type="hidden" value="' + getInPointId + '" id="getInPointId">';
            ticketHtml += '<input type="hidden" value="' + getOffPointId + '" id="getOffPointId">';
            ticketHtml += '<input type="hidden" value="' + getInTimePlan + '" id="getInTimePlan">';
            ticketHtml += '<input type="hidden" value="' + getOffTimePlan + '" id="getOffTimePlan">';
            ticketHtml += '<input type="hidden" value="' + startDate + '" id="startDate">';
        ticketHtml += '</div>';
    ticketHtml += '</div>';

    ticketHtml += '</div>';

    return ticketHtml;
}

function changeDate(dateStr, dateSelector) {
    if(dateStr === '') {
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

    $(dateSelector).datepicker("option", {
        minDate: new Date(date_Str)
    });
    $(dateSelector).val(dateStr);
}

/*Định dạng tiền*/
Number.prototype.format = function (e, t) {
    var n = "\\d(?=(\\d{" + (t || 3) + "})+" + (e > 0 ? "\\." : "$") + ")";
    return this.toFixed(Math.max(0, ~~e)).replace(new RegExp(n, "g"), "$&,")
};