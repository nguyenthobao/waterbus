var isRoundWaterBus = false;
var numberTicket = 1;

$(document).ready(function() {
    $('#numberTicket').val(numberTicket + " vé");
    $('#bookingWaterBus #isRound').change(function () {
        if($(this).is(":checked")){
            isRoundWaterBus = true;
            $('#divStartPoint').removeClass('col-12');
            $('#divStartPoint').addClass('col-6');
            $('#divEndPoint').show();
        } else {
            isRoundWaterBus = false;
            $('#divEndPoint').hide();
            $('#divStartPoint').removeClass('col-6');
            $('#divStartPoint').addClass('col-12');
        }
    });
    
    $('#upTicket').click(function () {
        numberTicket++;
        $('#numberTicket').val(numberTicket + " vé");
    });

    $('#downTicket').click(function () {
        if(numberTicket > 1) {
            numberTicket--;
        }

        $('#numberTicket').val(numberTicket + " vé");
    });
});
