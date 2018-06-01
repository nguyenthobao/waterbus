$(document).ready(function() {
    var numberTicket = 1;
    var depatureDate = $('#booingSaigonRiver #depatureDateRiver');

    depatureDate.datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0,
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
});