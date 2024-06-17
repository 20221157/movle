const db = require("../models"),
        Bookmark = db.Bookmark;
exports.addBookmark = async(req,res, next) => {
         try{
                 const userId = req.user.id;
                 const placeId = req.params.id;
		 const existingBookmark = await Bookmark.findOne({
			             where: {
					                     userId: userId,
					                     placeId: placeId
					                 }
			         });
		 if (existingBookmark) {
			 await existingBookmark.destroy();
			 next();
		 }
		 else {
                 Bookmark.create({
                         userId: userId,
                         placeId: placeId,

                });
			 next();
		 }
         }catch(er){
                 console.log(er);
		 res.status(500).send({ message: "북마크 저장 중 오류가 발생했습니다." });
		    
	 }

}
exports.addMovieBookmark = async(req,res, next) => {
         try{
                 const userId = req.user.id;
                 const movieId = req.params.id;
                 const existingBookmark = await Bookmark.findOne({
                                     where: {
                                                             userId: userId,
                                                             movieId: movieId
                                                         }
                                 });
                 if (existingBookmark) {
                         await existingBookmark.destroy();
                         next();
                 }
                 else {
                 Bookmark.create({
                         userId: userId,
                         movieId: movieId,

                });
                         next();
                 }
         }catch(er){
                 console.log(er);
                 res.status(500).send({ message: "북마크 저장 중 오류가 발생했습니다." });

	}
}
