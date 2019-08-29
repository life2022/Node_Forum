let express = require("express");

let router = new express.Router();

const fs = require("fs");

// 上传图片设置

const multer = require("multer");

const upload = multer({dest:"tmp/"});

const uploads = require("../../common/uploads.js");
// 系统管理首页的路由

router.get("/",function(req,res,next){
	// 读取文件中的内容

	let fileData = fs.readFileSync(__dirname+"/../../config/webConfig.json");

	let data = JSON.parse(fileData.toString());

	// 加载页面
	res.render("admin/system/index.html",{data:data});
});

// 系统管理的更新方法

router.post("/save",upload.single("logo"),function(req,res,next){
	// 接受上传的资源
	let imgRes = req.file;
	// 接受表单提交的数据
	let {title,keywords,description,count,copyright,record,logo} = req.body;

	// 判断该用户是否修改图片
	let newlogo="";
	if (imgRes) {
		newlogo = uploads(imgRes);
	}

	// 格式化数据

	let data = {
		title:title,
		keywords:keywords,
		description:description,
		copyright:copyright,
		record:record,
		count:count,
		logo:newlogo?newlogo:logo
	}


	fs.writeFileSync(__dirname+"/../../config/webConfig.json",JSON.stringify(data));

	if (imgRes) {
		fs.unlinkSync(__dirname+"/../../"+logo);
	};

	res.send("<script>alert('修改成功');location.href='/admin/system'</script>");
});

module.exports = router;