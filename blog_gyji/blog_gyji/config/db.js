//导入数据库模块


const    mysql = require("mysql");


//设置连接数据库的属性
const connect =mysql .createConnection({
	
	
	host:"localhost",
	user:"root",
	password:"root",
	database:"blog_gyji",
	
});

//开始连接数据库
console.log("mysql has connnected");
connect.connect();
console.log("mysql has closed");

//抛出

module.exports=connect;

