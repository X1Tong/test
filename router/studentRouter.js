const express = require('express');
const router = express.Router()//获取路由的实例
const db = require('../db.js');

/**
 * @api {post} /student/add 添加学生
 * @apiName 添加学生
 * @apiGroup Student
 *
 * @apiParam {String} sname 学生名称.
 * @apiParam {String} spaswd 学生密码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add', (req, res) => {
    let info = req.body;//获取表单提交的数据
    let student = {};
    for (let key in info) {
        student[key] = info[key];
    }
    //判断参数是否ok
    let studentname = student.sname
    let sqltea = 'select * from student where sname=?';
    db.base(sqltea, studentname, (result) => {
        if (result.length) {
            res.send({ err: -1, msg: '添加失败，教师已存在' })
        } else {
            let sql = 'insert into student set ?';
            db.base(sql, student, (result) => {
                if (result.affectedRows == 1) {
                    res.send({ err: 0, msg: '学生添加成功' })
                }
            });
        }
    })

})

/**
 * @api {post} /student/del 删除学生
 * @apiName del
 * @apiGroup Student
 *
 * @apiParam {Int} id id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/del', (req, res) => {
    let { id } = req.body
    let sql = 'delete from student where id=?';

    db.base(sql, id, (result) => {
        if (result.affectedRows == 1) {
            res.send({ err: 0, msg: '删除学生成功' })
        } else {
            res.send({ err: -1, msg: '删除学生失败' })
        }
    });
})


/**
 * @api {post} /student/getInfoById 回显学生信息
 * @apiName getInfoById
 * @apiGroup Student
 *
 * @apiParam {String} id 学生编号.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById', (req, res) => {
    let { id } = req.body
    // console.log(req.body)
    let sql = 'select * from student where id=?';

    db.base(sql, id, (result) => {
        if (result.length > 0) {
            res.send({ err: 0, msg: '查询成功', list: result })
        } else {
            res.send({ err: -1, msg: '查询失败' })
        }
    });
})

/**
 * @api {post} /student/update 修改学生
 * @apiName update
 * @apiGroup Student
 *
 * @apiParam {String} sname 学生名称.
 * @apiParam {String} spaswd 学生密码.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/update', (req, res) => {
    let info = req.body;//获取表单提交的数据
    let student = {};
    for (let key in info) {
        student[key] = info[key];
    }
    let studentname = student.sname
    let sqlname = 'select * from student where sname=?';
    db.base(sqlname, studentname, (result) => {
        // console.log(result[0].id)
        if (result.length) {
            let id = result[0].id
            let sql = 'update student set sname=?,spaswd=? where id=?';
            let data = [info.sname, info.spaswd, id];
            db.base(sql, data, (result) => {
                if (result.affectedRows == 1) {
                    res.send({ err: 0, msg: '学生修改成功' })
                    // res.redirect('/course');
                } else {
                    res.send({ err: -1, msg: '学生修改失败' })
                }
            });
        } else {
            res.send({ err: -1, msg: '请不要任意修改学生名称' })
        }
    });
})

/**
 * @api {post} /student/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup Student
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
    let sqlcount = 'select * from student';
    let sql = 'select * from student limit ' + page + ',' + pageSize;
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

// router.post('/show', (req, res) => {
//     let sql = 'select * from teacher';
//     db.base(sql, null, (result) => {
//         res.send({ err: 0, msg: '查询成功', list: result })
//     });
// })

module.exports = router;