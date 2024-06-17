const db = require("../models");

module.exports = {
	creatPostComment: (req, res) => {
		const postId = req.params.id;
		const commentText = req.body.comment;
		db.Comment.create({
			postId: postId,
			content: commentText,
			userId: req.user.id
		})
		.then(() => {
			res.redirect(`/post/${postId}`);
		})
		.catch(error => {
			console.error(error);
			res.redirect(`/post/${postId}`);
		});
	},
        creatPlaceComment: (req, res) => {
		const placeId = req.params.id;
		const commentText = req.body.comment;
                db.Comment.create({
		        placeId: placeId,
		        content: commentText,
		        userId: req.user.id // 로그인한 사용자의 ID (이 부분은 인증 미들웨어를 사용하고 있다고 가정)
		})
		.then(() => {
			res.redirect(`/place/${placeId}`);
		})
		.catch(error => {
			console.error(error);
			res.redirect(`/place/${placeId}`);
		});
	},
	creatMovieComment: (req, res) => {
                const movieId = req.params.id;
                const commentText = req.body.comment;
                db.Comment.create({
                        movieId: movieId,
                        content: commentText,
                        userId: req.user.id // 로그인한 사용자의 ID (이 부분은 인증 미들웨어를 사용하고 있다고 가정)
                })
                .then(() => {
                        res.redirect(`/movie/${movieId}`);
                })
                .catch(error => {
                        console.error(error);
                        res.redirect(`/movie/${movieId}`);
                });
        }
}

