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

function buildSchedulListOneWay(routeName) {
    $('.route-name').text(routeName);
}