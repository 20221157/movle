const db = require('../models'),
	{ v4: uuidv4 } = require('uuid'),
	{ body, validationResult } = require('express-validator');
	Board = db.Board,
	Post = db.Post,
	PostImage = db.PostImage,
	User = db.User;

const { geocodeAddress } = require('./mapController');
const main = require('./tmdb');
const createNewPlace = require('../addPlace');

module.exports = {
        deletePost: async (req, res) => {
                 try {
                         const postId = req.params.id;
                         await Post.findByIdAndDelete(postId);
                         res.status(200).json({ message: '게시물이 성공적으로 삭제되었습니다.' });
                 }catch {
                         res.status(500).json({ error: '게시물 삭제 중 오류가 발생했습니다.' });
                 }
        },

	getCommunity: async (req, res) => {
		try {
			const userId = req.user.id;
        		// 모든 게시판을 가져옵니다.
        		const boards = await Board.findAll();
        		// 모든 게시글을 가져옵니다.
        		const posts = await Post.findAll({
				include: [
					{
						model: User,
						attributes: ['nickname']
					},
					{
						model: PostImage,
						attributes: ['imagePath']
					}
				],
				order: [
					['updatedAt', 'DESC']
				]
        		});

			console.log(posts);
			// 게시판과 게시글을 템플릿에 전달하여 렌더링합니다.

        		res.render("community", { boards, posts, userId });
    		} catch (error) {
        		console.error('Error fetching community data:', error);
        		res.status(500).send('Internal server error');
    		}
	},
	createPost: async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const boards = await Board.findAll();	
		const { text, images } = req.body;
		const userId = req.user.id;
		const boardId = req.params.id;
		try {
			const post = await db.Post.create({ content:text, userId: userId, boardId: boardId });
			if (req.files && req.files.length > 0) {
				req.post = post;
			        next(); // 이미지 파일이 있으면 다음 미들웨어로 이동
			} else {
				const posts = await Post.findAll({
                                include: [
                                        {
                                                model: User,
                                                attributes: ['nickname']
                                        },
                                        {
                                                model: PostImage,
                                                attributes: ['imagePath']
                                        }
                                ],
                                order: [
                                        ['updatedAt', 'DESC']
                                ]
                        });

                        res.render("community", { boards, posts, userId });
			}

		}catch (error) {
			console.error(error);
			//res.status(500).json({ message:'Internal server error' });
			res.json({ success: false, message: 'Failed to save the post.' });
		}
	},
	getPost: async (req, res) => {
		try {

			const userId = req.user.id;
        		const boardId = req.params.id;
			const boards = await Board.findAll();
			const board = await Board.findByPk(boardId);

			// 해당하는 게시판이 없으면 404 에러를 반환합니다.
			if (!board) {
				return res.status(404).send('Board not found');
			}

			const posts = await Post.findAll({
				where: {
					boardId: boardId
				},
            			include: [
                			{
                    				model: User,
                    				attributes: ['nickname'], // 가져올 속성 지정
                			},
                                        {
                                            model: PostImage, // PostImage 모델을 포함
                                            attributes: ['imagePath'] // 가져올 속성 지정
                                        }
            			],
			        order: [
				        ['updatedAt', 'DESC'] // 작성일자순으로 정렬, 가장 최근게 앞에 오도록
				]
        		});

        		if (!board) { 
            			return res.status(404).send('Board not found');
        		}

        		res.render('community', { boards, posts, userId});
    		} catch (error) {
        		console.error('Error fetching posts:', error);
        		res.status(500).send('Internal server error');
    		}
	},
        uploadImage: async (req, res) => {
            try {
                if (!req.files || Object.keys(req.files).length === 0) {
                    return;
                }

		const post = req.post;
		const postId = post.id;
                const imageFiles = req.files.images; // 클라이언트에서 이미지 파일 필드명이 'image'로 전달됨

                // 이미지를 저장할 디렉토리 경로
                const uploadDir = path.join(__dirname, '../public/images/posts');

                // 만약 디렉토리가 존재하지 않으면 생성
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir);
                }

		for (const imageFile of imageFiles) {
			const filename = imageFile.name;
			const extension = filename.split('.').pop();
			const uuid = uuidv4();
			const imagePath = path.join(uploadDir, imageFile.name);
			await imageFile.mv(imagePath); 
		}

		res.render('community', { boards, posts});
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
        },
	creatPlace: async(req, res, nest) => {
		try {
	        const { movieTitle, city, district, road_name, building_number, text, images } = req.body;
		let placeAddress = `${city} ${district} ${road_name}`;
		if (building_number) {
		    placeAddress += ` ${building_number}`;
		}
        	// 영화 제목 검색
	        let movie = await db.Movie.findOne({ title: movieTitle });
        	if (!movie) {
	            // 데이터베이스에 없는 경우, TMDB에서 검색
        	    movie = await main(movieTitle);
	            if (!movie) {
        	        throw new Error('영화를 찾을 수 없습니다.');
            		}
        	}

	        // 주소 유효성 검사
		let validateAddress;
	       	const { latitude, longitude } = await geocodeAddress(placeAddress);
        	if (latitude && longitude) {
			validateAddress = true;
	        }
		else {
			validateAddress=false;
		}

		if (movie && validateAddress) {
			createNewPlace(text, movieTitle, city, district, road_name, description, name, images, building_number)			
		
		}

		const modifiedText = `${title}\n${placeAddress}\n${text}`;
        	next({text: modifiedText,images});
    	} catch (error) {
        	res.status(400).json({ error: error.message });
    	}
	}
}
