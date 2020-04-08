const express = require('express');
const router = express.Router()//获取路由的实例
const db = require('../db.js');

/**
 * @api {post} /course/add 添加课程
 * @apiName 添加课程
 * @apiGroup Course
 *
 * @apiParam {String} id 课程编号.
 * @apiParam {String} cname 课程名称.
 * @apiParam {Int} tid 教师编号.
 * @apiParam {String} category 课程分类.
 * @apiParam {String} description 课程描述.
 * @apiParam {String} src 图片路径.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/add', (req, res) => {
    let info = req.body;//获取表单提交的数据
    let course = {};
    for (let key in info) {
        course[key] = info[key];
    }
    //判断参数是否ok
    let teacherid = course.tid
    // console.log(teacherid)
    let sqltea = 'select * from teacher where id=?';
    db.base(sqltea, teacherid, (result) => {
        if (result.length > 0) {
            let sql = 'insert into course set ?';
            db.base(sql, course, (result) => {
                if (result.affectedRows == 1) {
                    res.send({ err: 0, msg: '添加成功' })
                }
            });
        } else {
            res.send({ err: -1, msg: '添加失败，教师不存在' })
        }
    })

})

/**
 * @api {post} /course/getInfoByType 分类查询
 * @apiName getInfoByType
 * @apiGroup Course
 *
 * @apiParam {String} category 课程分类.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/getInfoByType', (req, res) => {
    let { category } = req.body
    if (category == 0) {
        let sql1 = 'select * from course';
        db.base(sql1, null, (result) => {
            res.send({ err: 0, msg: '查询成功', list: result })
        });
    } else {
        let sql = 'select * from course where category=?';
        db.base(sql, category, (result) => {
            let count = result.length
            if (count > 0) {
                res.send({ err: 0, msg: '查询成功', list: result })
            } else {
                res.send({ err: -1, msg: '查询失败', list: result })
            }
        });
    }

})

/**
 * @api {post} /course/del 删除课程
 * @apiName del
 * @apiGroup Course
 *
 * @apiParam {Int} id id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/del', (req, res) => {
    let { id } = req.body
    let sql = 'delete from course where id=?';

    db.base(sql, id, (result) => {
        if (result.affectedRows == 1) {
            res.send({ err: 0, msg: '删除成功' })
        } else {
            res.send({ err: -1, msg: '删除失败' })
        }
    });
})


/**
 * @api {post} /course/getInfoById 回显课程信息
 * @apiName getInfoById
 * @apiGroup Course
 *
 * @apiParam {String} id 课程编号.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.post('/getInfoById', (req, res) => {
    let { id } = req.body
    // console.log(req.body)
    let sql = 'select * from course where id=?';

    db.base(sql, id, (result) => {
        if (result.length > 0) {
            res.send({ err: 0, msg: '查询成功', list: result })
        } else {
            res.send({ err: -1, msg: '查询失败' })
        }
    });
})

/**
 * @api {post} /course/update 修改课程
 * @apiName update
 * @apiGroup Course
 *
 * @apiParam {String} cname 课程名称.
 * @apiParam {Number} tid 教师编号.
 * @apiParam {String} category 课程分类.
 * @apiParam {String} description 课程描述.
 * @apiParam {String} src 图片路径.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post('/update', (req, res) => {

    let info = req.body;//获取表单提交的数据
    let course = {};
    for (let key in info) {
        course[key] = info[key];
    }
    let coursename = course.cname
    let sqlname = 'select * from course where cname=?';
    db.base(sqlname, coursename, (result) => {
        // console.log(result[0].id)
        if (result.length) {
            let id = result[0].id
            let teaid = course.tid
            let sqltid = 'select * from teacher where id=?'
            db.base(sqltid, teaid, (result) => {
                if (result.length) {
                    let sql = 'update course set cname=?,tid=?,category=?,description=? where id=?';
                    let data = [info.cname, info.tid, info.category, info.description, id];
                    db.base(sql, data, (result) => {
                        if (result.affectedRows == 1) {
                            res.send({ err: 0, msg: '修改成功' })
                            // res.redirect('/course');
                        } else {
                            res.send({ err: -1, msg: '修改失败' })
                        }
                    });
                }else{
                    res.send({ err: -1, msg: '添加的教师不存在' })
                }
            })

        } else {
            res.send({ err: -1, msg: '请不要任意修改课程名称' })
        }
    });
})

/**
 * @api {post} /course/getInfoByPage 分页查询
 * @apiName getInfoByPage
 * @apiGroup Course
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
    let sqlcount = 'select * from course';
    let sql = 'select * from course limit ' + page + ',' + pageSize;
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
    let sql = 'select * from course';
    db.base(sql, null, (result) => {
        res.send({ err: 0, msg: '查询成功', list: result })
    });
})

module.exports = router;