const express = require('express');
const router = express.Router()
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 指定文件路径
        cb(null, './static/image')
    },
    filename: function (req, file, cb) {
        // 指定文件名  文件名重复覆盖\后缀名发生改变
        let exts = file.originalname.split('.')
        let ext=exts[exts.length-1]
        
        let tmpname = (new Date()).getTime() + parseInt(Math.random() * 9999)//时间戳
        cb(null, `${tmpname}.${ext}`);//拼接
        // var fileFormat = (file.originalname).split('.')
        // cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})

var upload = multer({
    storage: storage
})

router.post('/upload', upload.single('courseImg'), (req, res) => {
    //courseImg 要上传图片数据的key值  必须前后端统一
    // {
    //     courseImg:'图片数据'
    // }
    console.log(req.file);
    let { size, mimetype, path } = req.file
    let types = ['jpg', 'png', 'jpeg']//允许上传的数据类型
    let tmpType = mimetype.split('/')[1] //截图图片类型
    if (size > 500 * 1024) {
        return res.send({ err: -1, msg: '图片尺寸超过500K' })
    } else if (types.indexOf(tmpType) == -1) {
        return res.send({ err: -2, msg: '图片类型错误' })
    } else {
        // let url='/public/image/'+req.file.filename
        let url=`/public/image/${req.file.filename}`
        return res.send({ err: 0, msg: '图片上传成功' ,img:url})
    }

})

module.exports = router