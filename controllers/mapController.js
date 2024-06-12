const db = require("../models");
const fetch = require('node-fetch');

async function geocodeAddress(address) {
    try {
        // 구글 맵 API를 사용하여 주소를 지오코딩합니다.
        const apiKey = 'AIzaSyDS7TvY3zbDbMsQIm9dVQsg9u94tq4DAds';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        // API 요청을 보냅니다.
        const response = await fetch(apiUrl);
	const data = await response.json();
	    console.log(data);
	// 지오코딩 결과에서 위도와 경도를 추출합니다.
        const location = data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        // 좌표를 반환합니다.
        return { latitude, longitude };
    } catch (error) {
        throw new Error('Error geocoding address');
    }
}

module.exports = { geocodeAddress };


module.exports = {
	getMap: async(req, res) => {
	  try {
	    // 주소 DB에서 모든 주소를 조회합니다.
	    const addresses = await db.Address.findAll();

	    // 클라이언트에게 전송할 데이터를 담을 배열을 생성합니다.
	    const addressData = [];

	    // 각 주소를 순회하면서 지오코딩하여 좌표로 변환합니다.
	    for (const address of addresses) {
	      const { latitude, longitude } = await geocodeAddress(address.full_address);
	      const places = await db.Place.findAll({ where: { addressId: address.id } });
	      const photoPaths = places.map(place => place.potoPath);

	      addressData.push({ latitude, longitude, addressInfo: address, photoPaths: photoPaths });
	    }
	    // 클라이언트에게 지도와 주소 데이터를 JSON 형태로 전송합니다.
	    res.render('map', { mapData: addressData }); // 클라이언트에서 이 데이터를 활용하여 지도에 핀을 표시합니다.
	  } catch (error) {
	    console.error('Error fetching addresses:', error);
	    res.status(500).send('Error fetching addresses');
	  }
	}

}
