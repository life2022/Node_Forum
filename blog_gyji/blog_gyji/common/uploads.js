const fs = require("fs");
const path = require("path");

function uploads(imgRes,type=''){
	// 可以获取文件的临时目录
	let tmpPath = imgRes.path;

	// 文件上传的执行目录
	let ext = path.extname(imgRes.originalname);
	let newName = ""+(new Date().getTime())+Math.round(Math.random()*10000)+ext;
	let newPath = "/upload/"+type+"/"+newName;

	// 进行文件拷贝

	let fileData = fs.readFileSync(tmpPath);
	fs.writeFileSync(__dirname+"/../"+newPath,fileData);

	return newPath;
}

module.exports= uploads;