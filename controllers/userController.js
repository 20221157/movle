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
	renderMyPage: (req, res) => {
		const userNickname = req.user.nickname;
		res.render("mypage", { layout: false, userNickname: userNickname });
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
