const Movie = require('./models/Movie');
const Place = require('./models/Place');
const Address = require('./models/Address');
const MoviePlace = require('./models/MoviePlace');

(async () => {
    try {
        // 영화 제목으로 영화를 찾습니다.
        const existingMovie = await Movie.findOne({ where: { title: '기생충' } });

        if (!existingMovie) {
            console.log('해당 영화를 찾을 수 없습니다.');
            return;
        }

        // 새로운 주소를 생성합니다.
        const newAddress = await Address.create({
            city: '서울특별시',
            district: '마포구',
            town: '아현동',
            road_name: '손정기로6길',
        });

        // 새로운 장소를 생성하고, 해당 장소가 새로운 주소를 참조하도록 설정합니다.
        const newPlace = await Place.create({
            potoPath: 'helminth',
            description: '기생충의 주인공인 기택이 사는 동네 계단이다. 기택계단으로 불리고 있다 ',
            name: '기택계단',
            AddressId: newAddress.id // 새로운 주소의 ID를 사용하여 관계 설정
        });

        // 영화와 새로운 장소의 관계를 설정합니다.
        await existingMovie.addPlace(newPlace);

        console.log('새로운 장소가 생성되었고, 영화와의 관계가 설정되었습니다:', newPlace.toJSON());
    } catch (error) {
        console.error('데이터 생성 또는 관계 설정 중 오류가 발생했습니다:', error);
    }
})();

