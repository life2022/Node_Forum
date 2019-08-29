//导入express

let express=require("express");

//实例化路由类

let router=express.Router();

//前台首页

router.get('/',function(req,res,next){
	
	res.send("Blog项目首页");
	
	
});

//前台分类页
router.get('/list',function(req,res,next){
	
	
	res.send("blog项目分类页");
	
});


//前台新闻详情页
router.get('/news',function(req,res,next){
	
	
	res.send("blog项目新闻详情页");
	
});

//前台登录页面
router.get('/login',function(req,res,next){
	
	
	res.send("blog项目登录页面");
	
});

//前台注册页面

router.get('/reg',function(req,res,next){
	
	
	res.send("blog项目注册页面");
	
});



module.exports=router;
