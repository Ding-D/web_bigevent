$(function () {
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 4 / 3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 为文件选择绑定change事件
    $('#file').on('change', function (e) {
        console.log(e);
        var file = e.target.files[0];
        var imgURL = URL.createObjectURL(file);
        // 初始化裁剪区
        $image.cropper('destroy')      //销毁旧的裁剪区域
            .attr('src', imgURL)  //重新设置图片路径
            .cropper(options)     //重新初始化裁剪区域
    })

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function () {
        // 裁剪后的图片
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 调用接口，将裁剪后的图片上传到文档
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})