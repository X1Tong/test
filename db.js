//封装操作数据库的通用api
//导入数据库
const mysql = require('mysql');

exports.base = (sql,data,callback)=>{
    //创建数据库连接
    const connection = mysql.createConnection({
        host:'localhost',//数据库所在的服务器的域名或者ip地址
        user:'root',//登陆数据库的账号
        password:'root',//登录数据库的密码
        port:'3307',//端口
        database:'data'//数据库名称
    });
    //执行连接操作
    connection.connect(function(err){
        if(err){
            console.log('数据库链接失败');
            throw err;
        }
    });

    //操作数据库（数据库操作也是异步的）
    connection.query(sql,data,function(error,results,fields){
        if(error){
            console.log('数据库操作失败');
            throw error;
        }  
        callback(results);
    });
    //关闭数据库
    connection.end(function(err){
        if(err){
            console.log('关闭数据库链接失败');
            throw err;
        }
    });
}