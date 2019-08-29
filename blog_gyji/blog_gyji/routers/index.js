// 导入express

let express = require("express");

// 实例化路由类

let router = express.Router();

// 导入文件处理模块

const fs = require("fs");

// 导入数据库相关模块

const mysql = require("../config/db.js");

// 导入moment模块

const moment = require("moment");

// 前台首页

router.get('/',function(req,res,next){
	// 读取网站配置相关数据'
	let webConfigData = fs.readFileSync(__dirname+"/../config/webConfig.json");
	let webConfig = JSON.parse(webConfigData.toString());

	// 读取分类信息

	mysql.query("select * from newstype order by sort desc",function(err,data){
		// 判断是否失败
		if (err) {
			return "";
		}else{
			// 读取轮播图信息

			mysql.query("select * from banner order by sort desc",function(err,data2){
				if (err) {
					return "";
				}else{

					// 查询最新发布的文章

					mysql.query("select news.*,newstype.name tname from news,newstype where news.cid = newstype.id order by news.id desc",function(err,data3){
						if (err) {
							return "";
						}else{
							data3.forEach(item=>{
								item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
							})

							// 热门文章
							mysql.query("select * from news order by num desc limit 5",function(err,data4){
								if (err) {
									return "";
								}else{
									data4.forEach(item=>{
										item.time = moment(item.time*1000).format("YYYY-MM-DD");
									})
									// 加载首页
									res.render("home/index.html",{
										webConfig:webConfig,
										typeData:data,
										sliderData:data2,
										newsData:data3,
										hotData:data4
									});
								}
							});
							
						}
					});
					
				}
			});
			
		}
	});
	
});


// 前台分类页

router.get('/list',function(req,res,next){
	let id = req.query.id;
	// 读取网站配置相关数据'
	let webConfigData = fs.readFileSync(__dirname+"/../config/webConfig.json");
	let webConfig = JSON.parse(webConfigData.toString());
	// 读取分类数据

	mysql.query("select * from newstype order by sort desc",function(err,data){
		if (err) {
			return "";
		}else{
			// 获取当前分类信息
			let typeInfo = "";
			data.forEach(item=>{
				if (item.id == id) {
					typeInfo=item;
				};
			});

			// 查询分类对应的新闻信息

			mysql.query("select * from news where cid = ? order by id desc",[id],function(err,data2){
				if (err) {
					return "";
				}else{

					data2.forEach(item=>{
						item.time = moment(item.time*1000).format("YYYY-MM-DD");
					});
					// 分类下的热们新闻
					mysql.query("select * from news where cid = ? order by num desc",[id],function(err,data3){
						if (err) {
							return "";
						}else{
							data3.forEach(item=>{
								item.time = moment(item.time*1000).format("YYYY-MM-DD");
							});
							// 加载首页
							res.render("home/list.html",{
								webConfig:webConfig,
								typeData:data,
								typeInfo:typeInfo,
								newsData:data2,
								hotData:data3
							});
						}
					});
					
				}
			});
			
		}
	});

});



// 前台新闻详情页

router.get('/news',function(req,res,next){

	let id = req.query.id;
	// 读取网站配置相关数据'
	let webConfigData = fs.readFileSync(__dirname+"/../config/webConfig.json");
	let webConfig = JSON.parse(webConfigData.toString());

	// 加载分类数据

	mysql.query("select * from newstype order by sort desc",function(err,data){
		if (err) {
			return "";
		}else{

			// 查询对应的文章数据
			mysql.query("select news.*,newstype.name tname from news,newstype where news.cid = newstype.id and news.id = "+id,function(err,data2){
				if (err) {
					return "";
				}else{
					data2[0].time = moment(data2[0].time*1000).format("YYYY-MM-DD HH:mm:ss");

					// 查询评论信息
					mysql.query("select user.username,comment.* from comment,user where comment.user_id = user.id and comment.news_id = ? order by comment.id desc",[id],function(err,data3){
						if (err) {
							return "";
						}else{
							data3.forEach(item=>{
								item.time = moment(item.time*1000).format("YYYY-MM-DD");
							});
							// 加载首页
							res.render("home/news.html",{
								webConfig:webConfig,
								typeData:data,
								newsData:data2[0],
								commentData:data3
							});
						}

					});
					
				}
			});
			
		}
	});
	
});



// 前台登录页面

router.get('/login',function(req,res,next){

	res.send("Blog项目登录页面");
});



// 前台注册页面

router.get('/reg',function(req,res,next){

	res.send("Blog项目注册页面");
});

module.exports = router;
