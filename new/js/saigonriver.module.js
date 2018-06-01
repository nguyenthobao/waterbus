$(document).ready(function() {
    var numberTicket = 1;
    var depatureDate = $('#booingSaigonRiver #depatureDate');

    depatureDate.datepicker({
        dateFormat: 'dd/mm/yy',
        minDate: 0,
    }).datepicker("setDate", new Date());
});