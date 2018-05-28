$(document).ready(function() {
    var isRoundWaterBus = false;
    var numberTicket = 1;

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
                $('#bookingWaterBus #startPoint').append("<option value='" + v.districtId + "'>" + v.districtName + "</option>");
            });

            $.each(listDistrict.reverse(), function (k, v) {
                $('#bookingWaterBus #endPoint').append("<option value='" + v.districtId + "'>" + v.districtName + "</option>");
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
    $('#bookingWaterBus #startPoint').change(function(){
        var id = $(this).val();
        $("#bookingWaterBus #endPoint option").show();
        $("#bookingWaterBus #endPoint option[value="+id+"]").hide();
    });

    $('#bookingWaterBus #endPoint').change(function(){
        var id = $(this).val();
        $("#bookingWaterBus #startPoint option").show();
        $("#bookingWaterBus #startPoint option[value="+id+"]").hide();
    });
});
