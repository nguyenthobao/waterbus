$(document).ready(function() {
    var numberTicket = 1;
    var depatureDate = $('#booingSaigonRiver #depatureDateRiver');

    var vehicleType = $('#booingSaigonRiver #vehicleType');

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

    $('#seachSaigonRiver').click(function () {
        if(depatureDate.val() === "") {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Chưa chọn ngày đi',
            });
            return false;
        }

        getSchedule(vehicleType, depatureDate);
    });

    /*Lấy danh sách các chuyến*/
    function getSchedule(vehicleType, date) {
        var dateAr = date.val().split('/');
        var newDate = dateAr[0] + '-' + dateAr[1] + '-' + dateAr[2];

        var startPoint = "P03k1Iq7vRvdDS";
        var endPoint = "P03k1IqIku8fXQ";

        $('.schedule-list').html('<div class="loading"></div>');

        $('#booingSaigonRiver .booing-form').hide(300);
        $('#booingSaigonRiver .list-schedule').show(300);

        $.ajax({
            type: "POST",
            url: "https://anvui.vn/listSchedule2",
            data: {
                startPoint: startPoint,
                endPoint: endPoint,
                date: newDate,
                companyId: systemId,
                vehicleTypeId: vehicleType.val(),
                page: 0,
                count: 1000
            },
            success: function (result) {
                console.log(result);
                buildSchedulListOneWay(result);
            }
        });
    }
});