### postman   接口测试

插件：express、body-parser、
###
### api接口的书写
    +接收数据
     -get req.query
     -post req.body 需要body-parser 插件进行解析
        +注意数据格式 json x-www-form-urencode
### 中间件
    +自定义中间件 （全局 局部）
    +内置中间件 static
    +第三方中间件 （body-parser) (拦截器)
中间件使用 一定要注意next
### 静态资源目录 static
    指定一个目录 目录可以被访问 

### 异步操作需要保持一定的执行顺序  回调函数的嵌套->回调地狱
    promise、asyc/await（es7）  处理回调函数的异步操作

### promise
大量的异步执行 如果需要顺序执行 通过回调函数执行 回调函数
通过promise 解决回调地狱
1、封装promise 函数
、、、
function test(){
    //返回promise
    return new Promise((resolve，reject)=>{
        //需要的异步处理
        成功的时候 resolve
        失败 reject
    })
}
、、、
2、根据程序 形成链式调用
    test() .then() .then() .catch()
3、捕获错误


### mysql
安装 npm install mysql --save

###  nodemon  自动更新代码
安装 npm install nodemon -g

### 注册登录
1、验证码逻辑接口实现
    a、验证用户名是否存在
    b、获取验证码

        1.获取邮箱验证码接口  1.发送邮件  2.邮箱和验证码保存在内存中
        2.5分钟之内 不能重新发送
        {1111@qq.com:{ctime:第一次发送的时间戳,cose:1233}}
        3.5分钟之内

2、apidoc 自动生成api接口文档
    apidoc -i ./router -o ./hehe  输入router文件夹下的文件，输出到hehe目录下

### 分页查询  MySQL语句的limit实现  难点是limit的使用（只能传递整数、变量字符类型等都不可以！）

### 上传图片 multer插件

### 跨域问题
ajax 同源策略 协议、主机（IP、域名）、端口号
１.协议、域名、端口号一致
２．ｃｏｒｓ  解决跨域问题
３．ｊｓｏｎｐ
４．代理  不需要后台  服务器请求没有跨域问题

前后端分离  前端矩阵（提供api接口，相对于多对一）

### api接口 
包含  url: http://www.xxx.com/user/reg
      参数
      结果
      方法
作用  前后端交互的桥梁
      前端：1.ajax 通过api接口传递数据
      后端： 通过api接收数据
      后端： 处理数据
      后端： 返回数据 {err:0 -1,msg:'xxx',data:}
      前端： 接收数据 页面的刷新渲染

### socket服务
实现socket的方式
1.net
2.socket.io 麻烦 兼容性好
3.websocket h5新增 低版本浏览器不兼容 使用方式简单

一、前后端连接
1.搭建socket 服务器 new WebSocket.server({port:3001},()=>{ })
    ws.on('connection')
2.前端进行连接   new WebSocket('ws://localhost:3001')
    ws.onOpen()
二、数据交互
3.前端主动发送数据
    client.on('massage',()=>{})
4.后端主动发送数据
    wx.onmessage=()=>{}
    wx.send()
三、前后端断开的处理
5.断开连接
ws.on('close')
ws.onClose()

什么时候用长连接  会员到期提醒、站内信、中奖（真正）。。。
1.数据刷新（轮询）
2.服务器端发起数据

时间换空间 空间换时间

### 身份验证
http请求  无状态
session+cookie  cookie-parser、express-session
1.登陆成功  发布一个加密字符串 （用户相关） 给前端(自动放在cookie)
2.调用其他接口 将加密字符串  作为参数传递给服务器  (cookie自动传递)
3.根据权限进行验证

jwt