$(document).ready(function() {
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
});