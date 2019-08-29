let express = require("express");

let router = new express.Router();

const path = require('path');

//设置文件上传
const multer=require("multer");




//设置上传的图片的临时存储位置


const upload = multer({dest:"tmp/"});
console.log(upload);


//导入fs模块
const fs=require("fs");

// 导入mysql模块

const mysql = require("../../config/db.js");







//轮播图管理路由

//首页
router.get("/",function(req,res,next){
	
	//查找轮播图中的数据
	
	//轮播图的显示
	mysql.query("select * from banner order by sort desc",function(err,data){
		
		
		if(err){
			return " ";
			
			}else{
			
			console.log(data);
			//加载页面
			//将数据分配给页面
	   res.render("admin/slider/index.html",{data:data});
	
		}
	});
	
	
});

//添加页
router.get("/add",function(req,res,next){
	res.render("admin/slider/add.html");
	
	
});

//处理添加的功能,看是否获取到了数据
router.post("/add",upload.single("img"),function(req,res,next){
	//获取表单数据
	//console.log(req.body);
	//获取文件的相关数据
	console.log(req.file);
	
	let {name,url,sort}=req.body;
//接收文件相关的数据
let imgRes=req.file;
     console.log(req.file);
     //可以获取文件的临时目录
     let tmpPath=imgRes.path;
     //文件上传的执行目录
     
      //获取图片后缀名
       let ext=path.extname(imgRes.originalname);
       
       console.log(ext);
     //获取时间撮（随机数+时间撮）
     let newName=""+(new Date().getTime())+Math.round(Math.random()*10000);
     let newPath="/upload/slider"+newName;
     console.log(tmpPath);
     console.log(newPath);
     
     //进行文件的拷贝
     let fileData=fs.readFileSync(tmpPath);
     
     fs.writeFileSync(__dirname+"/../../"+newPath,fileData);
     
     // 将数据插入到数据库中
	mysql.query("insert into banner(name,url,sort,img) value(?,?,?,?)",[name,url,sort,newPath],function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				
				//添加成功需要跳转到显示页面
				res.send("<script>alert('添加成功');location.href='/admin/slider'</script>");

			}else{
				res.send("<script>alert('添加失败');history.go(-1)</script>");
			}

		}
	})


     

})
// 修改页
router.get("/edit",function(req,res,next){
	// 获取修改数据的ID
	let id = req.query.id;
	console.log(id);
	// 查询对应的数据
	mysql.query("select * from banner where id = "+id,function(err,data){
		if (err) {
			return "";
		}else{
			// 加载页面
			res.render("admin/slider/edit.html",{data:data[0]});
		}
	});
});


//修改功能
router.post("/edit",upload.single("img"),function(req,res,next){
	// 接受图片信息
	let imgRes = req.file;
	// 接受表单数据
	let {id,name,url,sort,oldimg} = req.body;

	// 判断图片资源是否存在

	let sql="";
	let arr=[];
	if (imgRes) {
		// 先上传图片

		let img = uploads(imgRes,"slider");

		sql = "update banner set name = ?,url = ?,sort = ?,img = ? where id = ?";
		arr = [name,url,sort,img,id];
	}else{
		sql = "update banner set name = ?,url = ?,sort = ? where id = ?";
		arr = [name,url,sort,id];
	}

	// 发送sql语句
	mysql.query(sql,arr,function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				// 判断是否修改了图片
				if (imgRes) {
					if (fs.existsSync(__dirname+"/../../"+oldimg)) {
						fs.unlinkSync(__dirname+"/../../"+oldimg);
					};
				};
				res.send("<script>alert('修改成功');location.href='/admin/slider'</script>");
			}else{
				res.send("<script>alert('修改失败');history.go(-1)</script>");
			}
		}
	});
});




//删除功能

router.get("/ajax_del",function(req,res,next){
	// 接受用户删除的数据
	let {id,img} = req.query;

	// 删除数据

	mysql.query("delete from banner where id = "+id,function(err,data){
		if (err) {
			return "";
		}else{
			// 判断是否删除成功
			if (data.affectedRows==1) {
				// 删除对应的图片

				if (fs.existsSync(__dirname+"/../../"+img)) {
					//删除
					fs.unlinkSync(__dirname+"/../../"+img);
				};
				res.send("1");
			}else{
				res.send("0");
			}
		}
	});
	
	
	
	// 无刷新的修改排序

router.get("/ajax_sort",function(req,res,next){
	// 接受数据
	let {id,sort} = req.query;

	// 数据的修改
	mysql.query("update banner set sort = ? where id = ?",[sort,id],function(err,data){
		// 判断是否执行成功
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				res.send("1");
			}else{
				res.send("0");	
			}
		}
	});
});
	
	
	
	
	
	
})

module.exports=router;