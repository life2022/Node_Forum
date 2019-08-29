//导入express

let express=require("express");

//实例化

let router=new express.Router();


//用户管理的首页
router.get('/',function(req,res,next){
	
	res.send("用户管理的首页");
});

router.get('/add',function(req,res,next){
	
	res.send("用户添加");
});
router.get('/edit',function(req,res,next){
	
	res.send("用户修改");
});
router.get('/insert',function(req,res,next){
	
	res.send("用户管理的添加操作");
});
router.get('/save',function(req,res,next){
	
	res.send("用户管理的修改操作");
});
router.get('/delete',function(req,res,next){
	
	res.send("用户管理的删除操作");
});





module.exports=router;



