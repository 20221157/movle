async function initMap() {
    var initialLat = 37.591, initialLng = 127.017;
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: initialLat, lng: initialLng },
        zoom: 15,
    });

	mapData.forEach(address => {
        
	console.log("Latitude:", address.latitude, "Longitude:", address.longitude);
		var marker = new google.maps.Marker({
            position: { lat: address.latitude, lng: address.longitude },
            map: map,
            title: address.addressInfo.full_address // 마커에 툴팁으로 주소 표시
        });
    });

}

