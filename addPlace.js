const db = require('./models');
const { QueryTypes } = require('sequelize');


async function createNewPlace(text, movieTitle, city, district, road_name, description, name, photoPath, building_number = null) {
    try {
        // 영화 제목으로 영화를 찾습니다.
        const existingMovie = await db.Movie.findOne({ where: { title: movieTitle } });

        if (!existingMovie) {
            console.log('해당 영화를 찾을 수 없습니다.');
            return;
        }
	const newAddress = await db.Address.create({
            city: city,
            district: district,
            road_name: road_name,
	    building_number: building_number 
            // 필요한 다른 주소 정보를 추가하세요
        });

	if (newAddress) {
	const newPlace = await db.Place.create({
            potoPath: photoPath,
            description: text,
            name: name,
            addressId: newAddress.id, // 기존의 주소를 참조
	    movieId: existingMovie.id
        });
	}
        console.log('새로운 장소가 생성되었고, 영화와의 관계가 설정되었습니다:');
    } catch (error) {
        console.error('데이터 생성 또는 관계 설정 중 오류가 발생했습니다:', error);
    }
};
module.exports = createNewPlace;
