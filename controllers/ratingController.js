const db = require("../models");

module.exports = {
        addPlaceRating: (req, res) => {
		const { placeId, rating } = req.body;
		console.log('클라이언트에서 받은 placeId:', placeId);
		    console.log('클라이언트에서 받은 별점 값:', rating);
		res.status(200).send('별점 저장 완료');
	}
}

