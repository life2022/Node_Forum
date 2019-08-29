//导入express

let express=require("express");


//实例化

let router=express.Router();
const crypto = require('crypto');
const mysql = require("../config/db.js");


// 监听用户的访问地址，只有管理员能登录后台

router.use(function(req,res,next){
	// 判断url地址
	// 是否可以直接进行访问
	if (req.url != "/login" && req.url != "/check") {
		// 判断是否登录
		if (req.session.YzmMessageIsAdmin && req.session.YzmMessageUsername) {
			next();
		}else{
			res.send("<script>alert('请登录');location.href='/admin/login'</script>");
		}
	}else{
		next();
	}
});
// 登录页面
router.get("/login",function(req,res,next){
	res.render("admin/login.html");
});



// 登录处理操作
router.post("/check",function(req,res,next){
	// 接受数据

	let {username,password} = req.body;
	username+=""

	// 判断
	if (username) {
		if (password) {
			// 密码加密
			let md5 = crypto.createHash('md5');
			password = md5.update(password).digest('hex');

			// 判断数据库中是否存在该用户
			mysql.query("select * from admin where username = ? and password = ? and status = 0",[username,password],function(err,data){
				
				if (err) {
					return ""
				}else{

					if (data.length) {
						req.session.YzmMessageIsAdmin = true;
						req.session.YzmMessageUsername = data[0].username;
						res.send("<script>alert('登录成功');location.href='/admin/'</script>");

					}else{
						res.send("<script>alert('登录失败');location.href='/admin/login'</script>");
					}
				}
			});
		}else{
			res.send("<script>alert('请登录');location.href='/admin/login'</script>");
		}
	}else{
		res.send("<script>alert('请登录');location.href='/admin/login'</script>");
	}
})


// 退出路由
router.get("/logout",function(req,res,next){
	req.session.YzmMessageIsAdmin = false;
	req.session.YzmMessageUsername = "";
	res.send("<script>alert('退出成功');location.href='/admin/login'</script>");

});



//后台首页路由

router.get('/',function(req,res,next){
	
	//加载对应的后台页面
	res.render("admin/index");
	
});

//后台欢迎页面

router.get('/welcome',function(req,res,next){
	
	
	//加载对应的后台欢迎页面
	res.render("admin/welcome");
	
	
	
})


//管理员管理,导入管理员管理的路由

let adminRouter=require('./admin/admin');

router.use('/admin',adminRouter);

//会员管理

let userRouter=require('./admin/user');

router.use('/user',userRouter);



//栏目管理



//轮播图管理
let sliderRouter=require('./admin/slider');

router.use('/slider',sliderRouter);



// 新闻分类管理
let typeRouter = require('./admin/newtype.js');
router.use('/type',typeRouter);

// 新闻管理
let newsRouter = require('./admin/news.js');
router.use('/news',newsRouter);

// 评论管理
let commentRouter = require('./admin/comment.js');
router.use('/comment',commentRouter);



// 系统管理
let systemRouter = require('./admin/system');
router.use('/system',systemRouter);


module.exports=router;







