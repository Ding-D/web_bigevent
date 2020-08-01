$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    initTable();
    // 获取文章列表数据，渲染
    function initTable() {

        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页----传递red.total
                renderPage(res.total);


            }
        })
    }


    // 补零函数
    function padZero(data) {
        return data > 9 ? data : '0' + data;
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        var date = new Date(date);

        var y = padZero(date.getFullYear());
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());
        var hh = padZero(date.getHours());
        var mm = padZero(date.getMinutes());
        var ss = padZero(date.getSeconds());
        return y + '-' + m + '-' + d + ' -' + hh + ':' + mm + ' :' + ss
    }


    // 初始化文章分类列表数据，渲染
    inintCates();
    function inintCates() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();//因为layui name=cate_id的表单中没有数据，因为已经渲染完毕，动态添加的数据并不会重新渲染，此时使用 form.render()，重新渲染表单动态创建的元素
            }
        })
    }


    // 为文章分类列表的提交按钮绑定事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();

        // 获取筛选框内的文本
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;

        inintCates();//提交后根据提交数据（有了新的q值）重新渲染文章列表
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({


            elem: "pageBox",  //分页容器的id名，渲染到的页面元素
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//分页功能，依次为总条数，每页xx条，上一页按钮，分页区，下一页按钮，快捷跳转区（输入页码进行跳转），
            limits: [2, 3, 4, 5, 10],//x条每页

            // 发生分页切换的时候，触发jump回调
            // 1.点击页码的时候也会触发jump回调
            // 2.只要调用了laypage.render()的方法，就会触发jump回调函数
            jump: function (obj, first) {
                console.log(obj.curr);//得到当前页，以便向服务端请求对应页的数据
                console.log(obj.limit);//得到每页显示的数据的条数
                console.log(first);//判断是否是初次加载，类似于退出条件

                // 把最新的页码值，赋值到q这个查询对象中
                q.pagenum = obj.curr;

                // 把最新的条目数，赋值给q
                q.pagesize = obj.limit;
                // 根据最新的q 获取对应的列表数据，并渲染

                if (!first) {
                    initTable();
                }
            }

        })
    }

    // 为删除按钮绑定事件
    $('tbody').on('click', ".btn-delete", function () {
        var length = $('.btn-delete').lenght;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除？', { icon: 3, title: "提示" }, function (index) {
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if (length === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index)
        })
    })



    //点击编辑按钮，跳转到发布文章，并将信息填入表单
    $('tbody').on('click', ".btn-edit", function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认编辑？', { icon: 3, title: "提示" }, function (index) {
            $.ajax({
                method: "GET",
                url: '/my/article/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    var htmlStr = template('tpl-edit', res.data)
                    layer.open({
                        type: 1,
                        area: ['500px', '500px'],
                        title: '编辑文章',
                        content: htmlStr,
                    });
                }
            })
            layer.close(index)
        })
    })
})
