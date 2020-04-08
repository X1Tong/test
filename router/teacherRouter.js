const express = require('express');
const router = express.Router()//获取路由的实例
const db = require('../db.js');

/**
 * @api {post} /teacher/add 添加教师
 * @apiName 添加教师
 * @apiGroup Teacher
 *
 * @apiParam {String} tname 教师名称.
 * @apiParam {String} tpaswd 教师密码.
 * @apiParam {String} zc 教师职称.
 * @apiParam {String} introduction 教师简介.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add', (req, res) => {
    let info = req.body;//获取表单提交的数据
    let teacher = {};
    for (let key in info) {
        teacher[key] = info[key];
    }
    //判断参数是否ok
    let teachername = teacher.tname
    let sqltea = 'select * from teacher where tname=?';
    db.base(sqltea, teachername, (result) => {
        if (result.length) {
            res.send({ err: -1, msg: '添加失败，教师已存在' })
        } else {
            let sql = 'insert into teacher set ?';
            db.base(sql, teacher, (result) => {
                if (result.affectedRows == 1) {
                    res.send({ err: 0, msg: '教师添加成功' })
                }
            });
        }
    })

})

/**
 * @api {post} /teacher/del 删除教师
 * @apiName del
 * @apiGroup Teacher
 *
 * @apiParam {Int} id id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/del', (req, res) => {
    let { id } = req.body
    let sql = 'delete from teacher where id=?';

    db.base(sql, id, (result) => {
        if (result.affectedRows == 1) {
            res.send({ err: 0, msg: '删除教师成功' })
        } else {
            res.send({ err: -1, msg: '删除教师失败' })
        }
    });
})


/**
 * @api {post} /teacher/getInfoById 回显教师信息
 * @apiName getInfoById
 * @apiGroup Teacher
 *
 * @apiParam {String} id 教师编号.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById', (req, res) => {
    let { id } = req.body
    // console.log(req.body)
    let sql = 'select * from teacher where id=?';

    db.base(sql, id, (result) => {
        if (result.length > 0) {
            res.send({ err: 0, msg: '查询成功', list: result })
        } else {
            res.send({ err: -1, msg: '查询失败' })
        }
    });
})

/**
 * @api {post} /teacher/update 修改教师
 * @apiName update
 * @apiGroup Teacher
 *
 * @apiParam {String} tname 教师名称.
 * @apiParam {String} tpaswd 教师密码.
 * @apiParam {String} zc 教师职称.
 * @apiParam {String} introduction 教师简介.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/update', (req, res) => {
    let info = req.body;//获取表单提交的数据
    let teacher = {};
    for (let key in info) {
        teacher[key] = info[key];
    }
    let teachername = teacher.tname
    let sqlname = 'select * from teacher where tname=?';
    db.base(sqlname, teachername, (result) => {
        // console.log(result[0].id)
        if (result.length) {
            let id = result[0].id
            let sql = 'update teacher set tname=?,tpaswd=?,zc=?,introduction=? where id=?';
            let data = [info.tname, info.tpaswd, info.zc, info.introduction, id];
            db.base(sql, data, (result) => {
                if (result.affectedRows == 1) {
                    res.send({ err: 0, msg: '教师修改成功' })
                    // res.redirect('/course');
                } else {
                    res.send({ err: -1, msg: '教师修改失败' })
                }
            });
        } else {
            res.send({ err: -1, msg: '请不要任意修改教师名称' })
        }
    });
})

/**
 * @api {post} /teacher/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup Teacher
 *
 * @apiParam {Number} padeSize 每页数据显示.
 * @apiParam {Number} page 哪一页.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/getInfoByPage', (req, res) => {

    let PageSize = req.body.pageSize || 2 //设置默认值
    let Page = req.body.page || 1
    let pageSize = parseInt(PageSize)
    let page = (parseInt(Page) - 1) * pageSize
    let sqlcount = 'select * from teacher';
    let sql = 'select * from teacher limit ' + page + ',' + pageSize;
    db.base(sqlcount, null, (result) => {
        let count = result.length  //总的数据条数
        db.base(sql, null, (result) => {
            let allpage = Math.ceil(count / pageSize)   //总的页数
            if (result.length) {
                res.send({ err: 0, msg: '查询成功', info: { list: result, count: count, allpage: allpage } })
            } else {
                res.send({ err: -1, msg: '查询失败' })
            }
        })

    });


})

router.post('/show', (req, res) => {
    let sql = 'select * from teacher';
    db.base(sql, null, (result) => {
        res.send({ err: 0, msg: '查询成功', list: result })
    });
})

module.exports = router;