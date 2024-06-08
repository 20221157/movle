const db = require('../models'),
	Board = db.Board,
	Post = db.Post,
	User = db.User;

module.exports = {
	getCommunity: async (req, res) => {
		try {
        		// 모든 게시판을 가져옵니다.
        		const boards = await Board.findAll();

        		// 모든 게시글을 가져옵니다.
        		const posts = await Post.findAll({
            			include: [
                			{
                    				model: User,
                    				attributes: ['id', 'nickname']
                			}
                	        ]
        		});

        		// 게시판과 게시글을 템플릿에 전달하여 렌더링합니다.
        		res.render("community", { boards, posts });
    		} catch (error) {
        		console.error('Error fetching community data:', error);
        		res.status(500).send('Internal server error');
    		}
	},
	getPost: async (req, res) => {
		try {

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
                    				attributes: ['id', 'nickname'], // 가져올 속성 지정
                			}
            			]
        		});

        		if (!board) {
            			return res.status(404).send('Board not found');
        		}

        		res.render('community', { boards, posts});
    		} catch (error) {
        		console.error('Error fetching posts:', error);
        		res.status(500).send('Internal server error');
    		}
	}

}
