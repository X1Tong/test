const express = require('express');
const router = express.Router()//获取路由的实例
const db = require('../db.js');

// /**
//  * @api {post} /admin/ 渲染登录页
//  * @apiName 渲染登录页
//  * @apiGroup Admin
//  *
//  *
//  * @apiSuccess {String} firstname null.
//  * @apiSuccess {String} lastname  null.
//  */
router.get('/', (req, res) => {
	res.render('login',{})
})

/**
 * @api {post} /admin/login 管理员登陆
 * @apiName 管理员登陆
 * @apiGroup Admin
 *
 * @apiParam {String} mname 用户名.
 * @apiParam {String} mpaswd 用户密码.
 *
 * @apiSuccess {String} firstname null.
 * @apiSuccess {String} lastname  null.
 */
router.post('/login', (req, res) => {
    //获取数据
    let param = req.body;
	let sql = 'select count(*) as total from manager where mname=? and mpaswd=?';
    let data = [param.mname, param.mpaswd];
    db.base(sql, data, (result) => {
		if (result[0].total == 1) {
			
			req.session.login=true
			req.session.mname=param.mname
			res.send({err:0,msg:"登陆成功"})
			// req.session.mname = param.mname;
			// console.log('session:',param.mname);
			// res.redirect('/');
		} else {
            res.send({err:-2,msg:"登陆失败"})
			// res.redirect('/login');
		}
	});
    //数据处理
    //返回数据
})

/**
 * @api {post} /admin/logout 管理员退出
 * @apiName 管理员退出
 * @apiGroup Admin
 *
 *
 * @apiSuccess {String} firstname null.
 * @apiSuccess {String} lastname  null.
 */
router.post('/logout', (req, res) => {
	req.session.destroy() //销毁保存的session
	res.send({err:0,msg:'已退出'})
})

module.exports = router