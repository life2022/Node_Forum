// 导入express
const express = require("express");
// 实例化router
const router = express.Router();
// 导入数据库模块
const mysql = require("../../config/db.js");

const multer = require("multer");
const upload = multer({dest:"tmp/"});

const uploads = require("../../common/uploads.js");
const moment = require("moment");
const fs = require("fs");

const page = require("../../common/page.js");

// 声明路由规则
// 新闻管理首页

router.get("/",function(req,res,next){

	let p = req.query.p ? req.query.p :1;
	let size = 5;

	mysql.query("select count(*) tot from news,newstype type where news.cid = type.id",function(err,data){
		if (err) {
			return "";
		}else{
			let tot = data[0].tot;

			let fpage = page(tot,p,size);

			// 查询相关数据

			mysql.query("select news.*,type.name tname from news,newstype type where news.cid = type.id order by news.id desc limit ?,?",[fpage.start,fpage.size],function(err,data){
				if (err) {
					return "";
				}else{
					data.forEach(item=>{
						item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
					})
					// 加载新闻管理的首页
					res.render("admin/news/index.html",{data:data,show:fpage.show});
				}
			});

		}
	});
	

});

// 新闻管理的添加页面
router.get("/add",function(req,res,next){
	mysql.query("select * from newstype order by sort desc",function(err,data){
		if (err) {
			return "";
		}else{
			// 新闻管理添加页面
			res.render("admin/news/add.html",{data:data});
		}
	});
});

// 新闻管理添加功能

router.post("/add",upload.single("img"),function(req,res,next){
	// 接受文件上传资源
	let imgRes = req.file;
	// 接受表单上传内容
	let {title,keywords,description,info,author,cid,text} = req.body;
	let num = 0;
	let time = Math.round((new Date().getTime())/1000);
	// 进行图片上传
	let img = uploads(imgRes,"news");

	// 进行数据插入

	mysql.query("insert into news(title,keywords,description,info,author,cid,text,num,time,img) value(?,?,?,?,?,?,?,?,?,?)",[title,keywords,description,info,author,cid,text,num,time,img],function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				res.send("<script>alert('添加成功');location.href='/admin/news'</script>");
			}else{
				res.send("<script>alert('添加失败');history.go(-1);</script>");

			}
		}
	});

});

// 修改页面

router.get("/edit",function(req,res,next){
	// 获取用户需要修改的数据
	let id = req.query.id;

	// 查询新闻分类
	mysql.query("select * from newstype order by sort desc",function(err,data){
		// 判断是否执行成功
		if (err) {
			return "";
		}else{
			// 查询修改文章对应数据
			mysql.query("select * from news where id = "+id,function(err,data2){
				if (err) {
					return "";
				}else{
					// 加载修改页面
					res.render("admin/news/edit.html",{data:data,newData:data2[0]});
				}
			});
			
		}
	});

});


// 新闻管理的修改页面


router.post("/edit",upload.single("img"),function(req,res,next){
	// 接受文件上传资源
	let imgRes = req.file;
	// 接受表单数据
	let {id,cid,text,oldimg,author,info,description,keywords,title} = req.body;

	let img = oldimg;
	// 判断该用户是否修改图片
	if (imgRes) {
		img = uploads(imgRes,"news");
	};

	// 发送sql语句修改数据

	mysql.query("update news set cid= ? , text=? , author=? , info=? , description=? , keywords=? , title=? ,img = ? where id = ?",[cid,text,author,info,description,keywords,title,img,id],function(err,data){
		if (err) {
			return "";
		}else{
			// 判断影响行数
			if (data.affectedRows==1) {
				// 判断用户是否修改图片
				if (imgRes) {
					if (fs.existsSync(__dirname+"/../../"+oldimg)) {
						fs.unlinkSync(__dirname+"/../../"+oldimg);
					};
				};
				res.send("<script>alert('修改成功');location.href='/admin/news';</script>");
			}else{
				res.send("<script>alert('修改失败');history.go(-1);</script>");

			}
		}

	});
});

// 无刷新删除数据

router.get("/ajax_del",function(req,res,next){
	// 接受到删除的数据

	let {id,img} = req.query;

	// 删除数据
	mysql.query("delete from news where id = "+id,function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows==1) {
				// 删除封面图片
				if (fs.existsSync(__dirname+"/../../"+img)) {
					fs.unlinkSync(__dirname+"/../../"+img);
				};

				res.send("1");

			}else{
				res.send("0");
			}
		}
	});
});

module.exports = router;