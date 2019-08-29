// 导入express
const express = require("express");

// 实例化
const router = express.Router();

// 导入数据库
const mysql = require("../../config/db.js");

// 导入moment
const moment = require("moment");

// 展示评论管理

router.get("/",function(req,res,data){
	// 执行sql语句
	mysql.query("select comment.*,user.username,news.title,news.img from comment,user,news where comment.user_id = user.id and comment.news_id = news.id order by comment.id desc",function(err,data){
		if (err) {
			return "";
		}else{
			data.forEach(item=>{
				item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
			})
			// 加载页面
			res.render("admin/comment/index.html",{data:data});
		}
	});
	
});

// 无刷新修改状态

router.get("/ajax_status",function(req,res,data){
	// 接受数据
	let {id,status} = req.query;

	// 修改数据库中的数据
	mysql.query("update comment set status = ? where id = ?",[status,id],function(err,data){
		if (err) {
			return "";
		}else{
			if (data.affectedRows == 1) {
				res.send("1");
			}else{
				res.send("0");
			}
		}
	});
});

// 抛出
module.exports = router;