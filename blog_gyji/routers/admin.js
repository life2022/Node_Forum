//导入express

let express=require("express");


//实例化

let router=express.Router();


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




//新闻分类管理

//新闻管理



//评论管理

//系统管理


module.exports=router;







