$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });


    // 监听注册表单
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('http://ajax.frontend.itheima.net/api/reguser', {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);

            }
            layer.msg('注册成功！')
            $('#link_login').click();
        })
    })
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        // $.post('http://ajax.frontend.itheima.net/api/login', data, function (res) {
        //     if (res.status !== 0) {
        //         return layer.msg('登陆失败！');
        //     }
        //     layer.msg('登录成功！')
        //     localStorage.setItem('token', res.token)
        //     //跳转到后台
        //     location.href = '../../index.html';
        // })
        $.ajax({
            method: "POST",
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '../../index.html'
            }
        })
    })
})
// 1. 线上 DEMO 项目地址：http://www.escook.cn:8086/
// 2. 项目的 API 接口地址： https://www.showdoc.cc/escook?page_id=3707158761215217
