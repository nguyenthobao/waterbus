var isRound = 0;
var systemId = $("base").attr("id");

$(document).ready(function() {
    $('#active-waterbus').click(function () {
        $('#bookingWaterBus').show(500);
        $('#selectOption').hide();
        return false;
    });
    
    $('.backOption').click(function () {
        $('.booking').hide();
        $('#selectOption').show();
    });

    $('.datepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0
    }).datepicker("setDate", new Date());
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

function buildSchedulListOneWay(routeName, scheduleData) {
    var scheduleList = '';
    $('.route-name').text(routeName);
    $.each(scheduleData, function (k, v) {
        scheduleList += '<div class="col-12 margin-schedule">';
            scheduleList += '<div class="row schedule-item" ' +
                'data-price="' + v.ticketPrice + '" ' +
                'data-getinpoint="' + v.getInPointId + '" ' +
                'data-getoffpoint="' + v.getOffPointId + '" ' +
                'data-tripstatus="' + v.tripStatus + '" ' +
                'data-starttime="' + v.startTimeUnix + '">';
                scheduleList += '<div class="col-6">';
                    scheduleList += '<div class="schedule-date">' + getFormattedDate(v.startDate, 'dM') + '</div>';
                    if(v.startTimeUnix < Date.now() || v.tripStatus === 2) {
                        scheduleList += '<div class="schedule-status">Đã khởi hành</div>';
                    } else {
                        scheduleList += '<div class="totalEmptySeat">Còn trống ' + v.totalEmptySeat + ' vé</div>';
                    }
                scheduleList += '</div>';
                scheduleList += '<div class="col-6">';
                scheduleList += '<div class="schedule-time pull-right">' + getFormattedDate(v.startTimeUnix, 'time') + '</div>';
                scheduleList += '</div>';
            scheduleList += '</div>';
        scheduleList += '</div>';
    });
    $('.schedule-list').html(scheduleList);
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