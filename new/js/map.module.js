var map, marker, infoWindow;
var startMarker,endMarker;
function initStartMarker(latitude, longtitude, title) {
    var pos = {
        lat: latitude,
        lng: longtitude
    };

    if(startMarker !== undefined) {
        startMarker.setMap(null);
    }

    startMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: title
    });
    map.setCenter(pos);
    map.setZoom(13);
}
function initEndMarker(latitude, longtitude, title) {
    var pos = {
        lat: latitude,
        lng: longtitude
    };

    if(endMarker !== undefined) {
        endMarker.setMap(null);
    }

    endMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: title
    });
    map.setCenter(pos);
    map.setZoom(13);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 10.778861, lng: 106.693604},
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'Bạn đang ở đây!'
            });


            map.setCenter(pos);
            map.setZoom(15);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}