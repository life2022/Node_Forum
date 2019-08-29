//导入express框架
 let express=require('express');
 
 //初始化express
 let app=express();
 
 //处理post请求
 
 const bodyParser=require("body-parser");
 
 app.use(bodyParser.urlencoded({extended:false}));
 
 // 处理session

const session = require('express-session');

// 注册session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
 
 
 //设置模板引擎相关信息
  let ejs=require('ejs');
  
  //设置模板存放的目录
  
  //第一个参数：固定的
  //第二个参数：模板存在的目录
  app.set('views','./views')
  
  //定义使用的模板引擎
  //第一个参数：模板引擎的名称，模板引擎的后缀
  //第二个参数：模板引擎的方法
  app.engine("html",ejs.__express);
  
  //在app中注册模板引擎
  
  //第一个参数：固定不变
  //第二个参数：与定义的模板名称有关
  app.set("view engine","html");
  
  //设置静态资源的访问
  
  app.use("/public",express.static(__dirname+"/public"));
  app.use("/upload",express.static(__dirname+"/upload"));//设置轮播图中的图片的显示
    
 
 //导入前台路由
 let indexRouter=require("./routers/index");
 
 //导入后台台路由
 let adminRouter=require("./routers/admin");
 
 //使用前台路由
 //参数1：匹配路由规则
 //参数2：请求路由规则
 app.use('/',indexRouter);
 
 
 app.use('/admin',adminRouter);
 
 
 
 
 //完善博客项目首页的路由
 
// app.get('/',function(req,res,next){
 	  //req request对象 保存客户端的请求信息
 	  //res response对象  服务器端输入相应的信息
 	  //next 执行下一个方法
 	  
 	  //给页面输出一段文字
// 	  res.send("我是blog项目首页");
 	  
 	  //加载页面
// 	  res.render("home/index");
// 	
// 	
// 	
// });
 
 //监听服务	器
 app.listen(3000,function(){
 	
 	
 	console.log("node 服务已经启动！！ 端口 3000");
 });
