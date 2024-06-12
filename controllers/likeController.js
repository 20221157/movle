const db = require("../models"),
        Like = db.Like;
exports.movieLike = (req,res) => {
        //db create 오류
        // try{
        //         const userId = req.body.userId;
        //         const movieId = req.body.movieId;
        //         if(!req.body.isLogged){
        //                 res.render("/login",{layout:false});
        //         } else{
        //         console.log(movieId);
        //         console.log(userId);
        //         Like.create({
        //                 userId:userId,
        //                 movieId:movieId,
        //                 postId:null,
        //                 placeId:null,
        //                 commentId:null

        //         });
        //         }
        // }catch(er){
        //         console.log(er);

        // }

}
