var isRoundWaterBus = false;

$(document).ready(function() {
    $('#bookingWaterBus #isRound').change(function () {
        if($(this).is(":checked")){
            isRoundWaterBus = true;
            $('#divStartPoint').removeClass('col-12');
            $('#divStartPoint').addClass('col-6');
        } else {
            isRoundWaterBus = false;
            $('#divStartPoint').removeClass('col-6');
        }

    });
});
