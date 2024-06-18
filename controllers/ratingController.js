const db = require("../models");
const { Op } = require('sequelize');

module.exports = {
	saveRate: async (req, res) => {
		const rating = req.body.rating;
        	const id = req.params.id;
		const referer = req.headers.referer;
		const pathSegments = referer.split('/');
	        try {
	                if (req.isAuthenticated()) {
				const userId = req.user.id;
      			        if (pathSegments.length >= 2) {
			     		const secondLastPath = pathSegments[pathSegments.length - 2];
	  			        if (secondLastPath === 'place') {
	                        		const [ratingRecord, created] = await db.Rating.findOrCreate({
	                                		where: {
			                                        userId: userId,
	        		                                placeId: id
	                        		        },
			                                defaults: {
	        		                                rating: rating
	                        		        }
			                        });
	
			                        if (!created) {
	                		                await db.Rating.update({ rating: rating }, {
	                                		        where: {
			                                                [Op.and]: [
	        		                                                { userId: userId },
	                        		                                { placeId: id }
	                                        			]
	                                        		}
	                                		});
	                        		}
	                        		res.json({ averageRating: rating });
			     		} else if (secondLastPath === 'movie') {
	 			        	const [ratingRecord, created] = await db.Rating.findOrCreate({
							where: {
						        	userId: userId,
						        	movieId: id
					       		},
					     		defaults: {
						     		rating: rating
					     		}
				     		});
				     		if (!created) {
					     		await db.Rating.update({ rating: rating }, {
						     		where: {
							     		[Op.and]: [
								     		{ userId: userId },
								     		{ movieId: id }
							     		]
						     		}
					     		});
				     		}
				     		res.json({ averageRating: rating });
			     		}
				}
	                } else {
	                        res.status(401).json({ error: '로그인이 필요합니다.' });
	                }

	        } catch (error) {
	                console.error('별점 저장 중 오류:', error);
	                res.status(500).json({ error: '별점 저장 중 오류가 발생했습니다.' });
	        }

	}
}

