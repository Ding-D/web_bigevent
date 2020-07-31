$(function () {
    //
    var layer = layui.layer;
    var form = layui.form;


    initCard();
    function initCard() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }


    let indexAdd = null;
    //为添加按钮绑定事件
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#boxEditCate', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('上传失败')
                }
                initCard();
                layer.msg('上传成功')
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null;
    // 编辑按钮点击弹出编辑层
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html(),
        })


        var Id = $(this).attr('data-Id');
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    // 编辑后提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $(this)
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传失败！')
                }
                initCard();
                layer.msg('上传成功！')
                layer.close(indexEdit)
            }
        })
    })

    // 删除按钮
    $('tbody').on('click', '.btn-quit', function () {
        console.log($(this));
        console.log($(this).attr('data-Id'))
        var Id = $(this).attr('data-Id');
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + Id,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                initCard();
                layer.msg('删除成功')
            }
        })
    })
})