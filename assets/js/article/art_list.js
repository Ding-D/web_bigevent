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
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页
                renderPage(res.total);


            }
        })
    }

    // 补零函数
    function padZero(data) {
        return data > 9 ? data : '0' + data;
    }

    template.defaults.imports.dataFormat = function (date) {
        var date = new Date(date);

        var y = padZero(date.getFullYear());
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());
        var hh = padZero(date.getHour());
        var mm = padZero(date.getMinutes());
        var ss = padZero(dare.getSecond());
        return y + '-' + m + '-' + d + ' -' + hh + ':' + mm + ' :' + ss
    }

    // 获取分类列表数据，渲染
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
                form.render();
            }
        })
    }
    // 为分类列表的提交按钮绑定事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        inintCates();
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: "pageBox",  //分页容器的id名
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            // 发生分页切换的时候，触发jump回调
            // 1.点击页码的时候也会触发jump回调
            // 2.只要调用了laypage.render()的方法，就会触发jump回调函数
            jump: function (obj, first) {
                console.log(obj.curr);
                console.log(first);

                // 把最新的页码值，赋值到q这个查询函数中
                q.pagenum = obj.curr;

                // 把最新的条目数赋值给q
                q.pagesize = obj.limit;
                // 根据最新的q 获取对应的列表数据，并渲染

                if (!first) {
                    initTable();
                }
            }

        })
    }
})
