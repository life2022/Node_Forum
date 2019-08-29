let express = require("express");

let router = new express.Router();

// 导入数据库模块

const mysql = require("../../config/db.js");
// 导入分页方法

const page = require("../../common/page.js");

// 导入时间格式化

const moment = require("moment");

//会员管理首页
router.get('/',function(req,res,next){
	
	
		//如何开发分页
		//第一页 0，5
		//第二页 5，5个
		//第三页 10 5
		//第四页  15 5
		//获取页码
		let p = req.query.p ? req.query.p :1;
		//console.log(p);
		// 接受检索的数据

	  let search = req.query.search ? req.query.search :"";
//默认每页展示数据
let size=3;




     //计算总数据
	
	mysql.query("select count(*) tot from user where username like ? ",['%'+search+'%'],function(err,data){
		
		
		
		
		// 判断
		if (err) {
			return "";
		}else{
			// 获取总数据
			let tot = data[0].tot;

			let fpage = page(tot,p,size);
			// 查看数据
			
			mysql.query("select * from user where username like ?  order by id desc limit ?,?",['%'+search+'%',fpage.start,fpage.size],function(err,data)
			{
		
	      //判断是否有错误
		if(err){
			return "";
			
		}else{
			
			
			// 将时间格式化
					data.forEach(item=>{
						//item.username = item.username;
						//item.time = moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss");
						item.time = moment(item.time).format("YYYY-MM-DD HH:mm:ss");
							
					})
			
				
			
			console.log(data);
			//加载页面
	  res.render("admin/user/index",{data:data,show:fpage.show,search:search});
		}
		
		
	
			});
		}
	});

	

});



module.exports = router;