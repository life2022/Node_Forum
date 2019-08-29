//导入express

let express=require("express");

//实例化

let router=new express.Router();


//管理员管理的首页
router.get('/',function(req,res,next){
	
//	res.send("管理员管理的首页");

//加载页面
res.render("admin/admin/index.html");
});


router.get('/add',function(req,res,next){
	
//	res.send("管理员添加");
//加载页面
res.render("admin/admin/add.html");
});


//管理员添加功能
router.post('/add',function(req,res,next){
	
console.log(req);

});




router.get('/edit',function(req,res,next){
	
	res.send("管理员修改");
});
router.get('/insert',function(req,res,next){
	
	res.send("管理员管理的添加操作");
});
router.get('/save',function(req,res,next){
	
	res.send("管理员管理的修改操作");
});
router.get('/delete',function(req,res,next){
	
	res.send("管理员管理的删除操作");
});





module.exports=router;



