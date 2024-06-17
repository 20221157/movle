const db = require("../models"),
	nodemailer = require('nodemailer'),
	bcrypt = require('bcrypt');
	passport = require("passport"),
	User = db.User;

module.exports = {
	login: (req, res) => {
		res.render("login", {layout: false});
	},
	logout: (req, res, next) => {
		req.logout((err) => {
			res.locals.redirect = "/";
			next();
		});
	},
	authenticate: passport.authenticate("local", {
		failureRedirect: "/login",
                successRedirect: "/",
        }),
	requireLogin: (req, res, next) => {
		if (req.isAuthenticated()) {  //req.session && req.session.user => req.isAuthenticated
			return next();
		}else {
			return res.redirect("/login");
		}
	},
	changePassword: async (req, res) => {
		const password = req.body.password;
		const checkPassword = req.body.checkPassword;
		const userId = req.user.id;
		
		if (password !== checkPassword) {
	        	return res.status(400).json({ message: 'Passwords do not match.' });
	    	}
		try{
			const user = await db.User.findOne({ where: { id: userId }});
			user.setPassword(password, async (err, updatedUser) => {
		        	if (err) {
		        		console.error('비밀번호 설정 오류:', err);
		                	return res.status(500).json({ message: '비밀번호 설정 중 오류가 발생했습니다.' });
		        	}
		            	// 비밀번호 설정이 성공적으로 완료되었을 때
		            	await updatedUser.save(); // 저장

				req.session.flash = { type: 'success', message: '비밀번호가 성공적으로 변경되었습니다.' };
		            	// 성공적으로 비밀번호 변경 완료
				res.redirect('mypage');
				//res.send('<script>alert("비밀번호가 성공적으로 변경되었습니다.");</script>');
		        });
		} catch (error) {
			console.error('Error updating password:', error);
			res.status(500).json({ message: 'Internal server error.' });
		}
	},
	renderMyPage: async (req, res) => {
		const type = req.query.type;
		const userId = req.user.id;
		let select;
		let sends = [];
		switch (type) {
			case 'bookmarks':
				const bookmarks = await db.Bookmark.findAll({
					where: { userId: userId }
				});
		                for (const bookmark of bookmarks) {
		                    if (bookmark.placeId) {
		                        // 북마크에 장소 ID가 있는 경우 장소 정보 조회
		                        const place = await db.Place.findOne({
						where: { id: bookmark.placeId}
					});
		                        if (place) {
		                            sends.push({
		                                type: 'bookmark',
		                                placeName: place.name,
		                                placeImagePath: place.potoPath,
						placeId: place.id
		                            });
		                        }
		                    } else if (bookmark.movieId) {
		                        // 북마크에 영화 ID가 있는 경우 영화 정보 조회
		                        const movie = await db.Movie.findOne({
						where: { id: bookmark.movieId }
					});
		                        if (movie) {
		                            sends.push({
		                                type: 'bookmark',
		                                movieTitle: movie.title,
		                                movieImagePath: movie.imagePath,
						movieId: movie.id
		                            });
		                        }
		                    }
		                }
				select = 'Bookmarks';
				break;
			case 'posts':
				const posts = await db.Post.findAll({
                                        where: { userId: userId }
                                });
				for (const post of posts) {
					const user = await db.User.findOne({
						where: {id: post.userId}
					});
					const postImages = await db.PostImage.findAll({
   				                where: { postId: post.id }
				        });
					const images = postImages.map(img => img.imagePath);
	                                sends.push({
		                                type: 'post',
		                                userName: user.nickname,
                                                postContent: post.content,
						postId: post.id,
                                                images: images
                                        });
				}
				select = 'Posts';
				break;
			case 'settings':
				select = "Settings";
				break;
			default:
				const likes =  await db.Like.findAll({
		                        where: { userId: userId }
		                });
                                for (const like of likes) {
                                    if (like.placeId) {
                                        // 북마크에 장소 ID가 있는 경우 장소 정보 조회
                                        const place = await db.Place.findOne({
                                                where: { id: like.placeId}
                                        });
                                        if (place) {
                                            sends.push({
                                                type: 'bookmark',
                                                placeName: place.name,
                                                placeImagePath: place.potoPath,
						placeId: place.id
                                            });
                                        }
                                    } else if (like.movieId) {
                                        // 북마크에 영화 ID가 있는 경우 영화 정보 조회
                                        const movie = await db.Movie.findOne({
                                                where: { id: like.movieId }
                                        });
                                        if (movie) {
                                            sends.push({
                                                type: 'bookmark',
                                                movieTitle: movie.title,
                                                movieImagePath: movie.imagePath,
						movieId: movie.id
                                            });
                                        }
                                    }
                                }
				select = 'Likes';
		}
		const userNickname = req.user.nickname;
		res.render("mypage", { layout: false, userNickname: userNickname, sends, select, flash: req.session.flash });
	},
	changeNickname: async (req, res) => {
		try{
		const userId = req.user.id;
		const newNickname = req.body.nickname;
		await db.User.update({ nickname: newNickname }, { where: { id: userId } });
		//res.render("mypage", { layout: false, userNickname: newNickname});
		res.redirect('mypage');
		}catch (error) {
			console.error('닉네임 업데이트 중 오류:', error);
			res.status(500).send('서버 오류로 닉네임 업데이트에 실패했습니다.');
		}
	},
	redirectView: (req, res) => {
		res.redirect('/');
	},
	getSingupPage: (req, res) => {
		res.render('signup',{layout: false}); // 회원가입 폼을 제공하는 뷰 렌더링 //false => true 수정
	},
	singupUser: async (req, res) => {
		try {
			const { id, password, nickname, name, birthdate, email } = req.body;
		        const existingUser = await User.findOne({ where: { id } });
		        if (existingUser) {
			        return res.status(400).send('이미 존재하는 아이디입니다.');
			}
			const user = await User.register({
			        id: id,
			        nickname: nickname,
			        birthdate: birthdate,
			        name: name,
			        email: email
			}, password, function(err, user) {
				if (err) {
					console.error('사용자 등록 실패:', err);
				} else {
					req.flash('success', '사용자 등록이 성공적으로 완료되었습니다.');
					console.log('사용자 등록 완료:', user);
					res.redirect('/login');
				}
			}); 

		} catch (error) {
			console.error(error);
			res.status(500).send('서버 오류');
		}
	},
	updateAndSend: async (req, res) => {
		const { id, email } = req.body;
		try {
        		// 이메일과 ID에 해당하는 사용자 찾기
        		const user = await User.findOne({where: { id, email }});
			console.log(user);
        		if (!user) {
	                	return res.status(404).json({ message: '해당 아이디를 가진  사용자를 찾을 수 없습니다.' });
        		}

		       
			const newPassword = Math.random().toString(36).slice(-8);
                        user.setPassword(newPassword, async (err) => {
                                if (err) {
                                        console.error(err, user);
					 return res.status(500).json({ message: '비밀번호 설정 중 오류가 발생했습니다.', error: err });
				}
				try {
                                        await user.save();
                                        console.log('Password changed successfully', user);
			
					// 이메일 전송 설정
		        		const transporter = nodemailer.createTransport({
		            			service: 'gmail',
		            			auth: {
		                			user: 'server0movle@gmail.com',
		                			pass: 'cmvo sjrq odnf xfis'
		            			}
		        		});

		        		// 이메일 내용 설정
		        		const mailOptions = {
		            			from: 'server0movle@gmail.com',
		            			to: email,
		            			subject: '비밀번호 재설정 요청',
		            			text: `새로운 비밀번호: ${newPassword}`
		        		};

				        // 이메일 전송
		        		transporter.sendMail(mailOptions, (error, info) => {
		            			if (error) {
		                			console.log(error);
							return res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
		            			} else {
		                			console.log('Email sent: ' + info.response);
							return res.status(200).json({ message: '이메일로 새로운 비밀번호가 전송되었습니다.' });
		            			}
		        		});


					res.redirect('/');
				}catch(saveErr) {
				        console.error('Error saving user:', saveErr);
					return res.status(500).json({ message: '사용자 저장 중 오류가 발생했습니다.', error: saveErr });
		                                       
				}
			});
    		} catch (error) {
        		console.error(error);
        		res.status(500).json({ message: '내부 서버 오류가 발생했습니다.' });
    		}
	}

}
