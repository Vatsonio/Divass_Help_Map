function initMap() {
    var ukraine = {
        lat: 48.3794,
        lng: 31.1656
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: ukraine,
        disableDefaultUI: true,
        styles: [{
            "stylers": [{
                "hue": "#808080"
            }, {
                "saturation": -100
            }]
        }]
    });

    // Створюємо масив заявок
    var requests = [
        { lat: 49.842957, lng: 24.031111, info: 'Пропавший: Іван Іванович. Останнє місце перебування: Львів' },
        { lat: 50.45466, lng: 30.5238, info: 'Пропавший: Петро Петрович. Останнє місце перебування: Київ' },
        { lat: 46.482526, lng: 30.72331, info: 'Пропавший: Микола Миколайович. Останнє місце перебування: Одеса' },
        { lat: 48.922633, lng: 24.711117, info: 'Пропавший: Василь Васильович. Останнє місце перебування: Івано-Франківськ' },
        { lat: 49.233083, lng: 28.468217, info: 'Пропавший: Андрій Андрійович. Останнє місце перебування: Вінниця' },
        { lat: 47.8388, lng: 35.139567, info: 'Пропавший: Олег Олегович. Останнє місце перебування: Запоріжжя' },
        { lat: 48.015883, lng: 37.80285, info: 'Пропавший: Сергій Сергійович. Останнє місце перебування: Донецьк' },
        { lat: 44.61665, lng: 33.525367, info: 'Пропавший: Юрій Юрійович. Останнє місце перебування: Севастополь' }
    ];

    // Для кожної заявки створюємо мітку
    requests.forEach(function(request) {
        var marker = new google.maps.Marker({
            position: { lat: request.lat, lng: request.lng },
            map: map
        });

        var infoWindow = new google.maps.InfoWindow({
            content: request.info
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

initMap();