var isRoundWaterBus = false;

$(document).ready(function() {
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
});
