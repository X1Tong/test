const express = require('express');
const bodyparser = require('body-parser')
const cookieParse = require('cookie-parser')
const session = require('express-session')
const path = require('path')
//express实例化
const app = express();

//获取静态图片，为静态图片地址做拼接
app.use('/public', express.static(path.join(__dirname, './static')))

// 设置静态资源目录（很重要！！！ 如果没有这一步那么浏览器将不能访问静态资源）
app.use(express.static(path.join(__dirname,'./static/html')))

//设置模板引擎
app.set('views', path.join(__dirname, 'static/html'));//设置模板的路径
app.set('view engine', 'html');//设置对应的模板后缀
app.engine('html', require('express-art-template'));//使用express兼容art-template模板引擎

//邮箱
const Mail = require('./utils/mail')
console.log(Mail);
const codes = {}//通过内存保存验证码

//通过cors解决跨域问题
const cors = require('cors')
app.use(cors())

//session 配置
app.use(session({
    secret: 'cousermanager123',     //秘钥
    resave: true,   // 即使 session 没有修改也保存 session 值
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 *60 }   //回话保存时间 一小时
}))

//app.use  使用中间件（插件）
//解析表单数据 x-www-form-urlencode
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());//处理json格式的数据

//路由
const adminRouter = require('./router/adminRouter');
const courseRouter = require('./router/courseRouter');
const studentRouter = require('./router/studentRouter');
const teacherRouter = require('./router/teacherRouter');
const fileRouter = require('./router/fileRouter');

app.use('/admin', adminRouter);
app.use('/course', (req, res, next) => {
    // console.log(req.body)
    // console.log(req.session)
    if(req.session.login){
        next()
    }else{
        res.send({err:-999,msg:'请先登录'})
    }
    
}, courseRouter);
app.use('/student', (req, res, next) => {
    if(req.session.login){
        next()
    }else{
        res.send({err:-999,msg:'请先登录'})
    }
}, studentRouter);
app.use('/teacher', (req, res, next) => {
    if(req.session.login){
        next()
    }else{
        res.send({err:-999,msg:'请先登录'})
    }
}, teacherRouter);
app.use('/file', (req, res, next) => {
    if(req.session.login){
        next()
    }else{
        res.send({err:-999,msg:'请先登录'})
    }
}, fileRouter);

//发送邮件验证码
app.post('/getMailCode', (req, res) => {
    const { mail } = req.body
    const code = parseInt(Math.random() * 1000)//产生验证码
    console.log(codes)
    Mail.send(mail, code)
        .then(() => {
            codes[mail] = code//将邮箱和邮箱匹配的验证码保存到缓存中
            res.send({ err: 0, msg: '验证码发送成功' })
        })
        .catch(() => {
            res.send({ err: -1, msg: '验证码发送失败' })
        })
})

app.listen(3001, () => {
    //监听端口 开启服务器
    console.log('server start');
})