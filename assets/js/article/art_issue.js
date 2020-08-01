$(function () {
    var layer = layui.layer;
    var form = layui.form;

    inintCates();
    function inintCates() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();//layui name=cate_id的表单中没有数据，因为已经渲染完毕，动态添加的数据并不会重新渲染，此时使用 form.render()，重新渲染表单动态创建的元素
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()




    //  裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $('#image').cropper(options)
    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 为文件选择绑定change事件
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0];
        if (file.length === 0) {
            return
        }
        var imgURL = URL.createObjectURL(file);//编译为base64代码
        // 初始化裁剪区
        $('#image').cropper('destroy')      //销毁旧的裁剪区域
            .attr('src', imgURL)  //重新设置图片路径
            .cropper(options)     //重新初始化裁剪区域
    })



    // 定义文章的发布状态
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })
    // 为表单绑定submit事件
    $('#form-issue').on('submit', function (e) {
        e.preventDefault();
        // console.log($(this)[0]);
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);

        fd.append('state', art_state)

        $('#image').cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                issuelishArticle(fd);
            })
    })



    function issuelishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})