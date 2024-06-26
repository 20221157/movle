const db = require("../models"),
        Like = db.Like;
exports.addLike = async(req,res, next) => {
         try{
                 const userId = req.user.id;
                 const placeId = req.params.id;
		 const existingLike = await Like.findOne({
			             where: {
					                     userId: userId,
					                     placeId: placeId
					                 }
			         });
		 if (existingLike) {
			 await existingLike.destroy();
			 next();
		 }
		 else {
                 Like.create({
                         userId: userId,
                         placeId: placeId,

                });
			 next();
		 }
         }catch(er){
                 console.log(er);
		 res.status(500).send({ message: "좋아요 저장 중 오류가 발생했습니다." });
		    
	 }

}
exports.addMovieLike = async(req,res, next) => {
         try{
                 const userId = req.user.id;
                 const movieId = req.params.id;
                 const existingLike = await Like.findOne({
                                     where: {
                                                             userId: userId,
                                                             movieId: movieId
                                                         }
                                 });
                 if (existingLike) {
                         await existingLike.destroy();
                         next();
                 }
                 else {
                 Like.create({
                         userId: userId,
                         movieId: movieId,

                });
                         next();
                 }
         }catch(er){
                 console.log(er);
                 res.status(500).send({ message: "좋아요 저장 중 오류가 발생했습니다." });
	}
}

