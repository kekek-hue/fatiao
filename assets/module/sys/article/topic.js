layui.use(['ppp', 'layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'setter'], function () {
    var laypage = layui.laypage //分页
        , table = layui.table //表格
        , jq = layui.jquery
        , form = layui.form
        , setter = layui.setter
        , layedit = layui.layedit
        , laydate = layui.laydate
        , ppp = layui.ppp;
    //执行一个 table 实例
    table.render({
        elem: '#article-table'
        , height: 420
        , url: setter.serverUrl + 'article/topic/list' //数据接口
        , toolbar: '#articleTool'
        , title: '专题文章列表'
        , page: true //开启分页
        , parseData: function (res) { //res 即为原始返回的数据
            var count = res.pageCount;
            var total = res.total;
            var list = res.data;
            return {
                "code": 0, //解析接口状态
                "count": total,
                "data": list //解析数据列表
            };
        }
        , cols: [[ //表头
            {type: 'checkbox', fixed: 'left'}
            , {field: 'id', title: 'ID', sort: true, fixed: 'left'}
            , {field: 'title', title: '文章标题'}
            , {
                field: 'face',
                title: '封面',
                templet: '<div><img class="load-cover" style="height:50px" src="{{d.cover_url}}"></div>'
            }
            , {field: 'published', title: '上传时间', sort: true, totalRow: true}
            , {field: 'category_name', title: '分类名称', sort: true, totalRow: true}
            , {fixed: 'right', align: 'center', title: '标签', toolbar: '#label'}
            , {fixed: 'right', align: 'center', title: '文章', toolbar: '#article'}
            , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
        ]]
        , done: function (res, curr, count) {
        }
    });

    //分页
    laypage.render({
        elem: 'pageDemo' //分页容器的id
        , count: 100 //总页数
        , skin: '#1E9FFF' //自定义选中色值
        //,skip: true //开启跳页
        , jump: function (obj, first) {
            if (!first) {
                layer.msg('第' + obj.curr + '页', {offset: 'b'});
            }
        }
    });

    //查询开始
    jq('.reload-btn').on('click', function () {
        var id = jq('#id').val();
        var title = jq('#title').val();
        var info = jq('#info').val();
        //执行重载
        table.reload('article-table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                id: id,
                name: name,
                info: info
            }
        });
    });
    //查询结束
    //监听提交
    form.on('submit(newsUpdateForm)', function (data) {
        form.render();
        jq.post("../article/update", data.field, function (data) {
            if (data.code == 200) {
                layer.alert('修改成功', {icon: 1, title: '提示'});
                location.reload()
            } else {

            }
        }, "json");
        return false;
    });

    table.on('tool(article-table)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'edit': //编辑专题
                location.href = '#!editTopic/' + data.id;
                break;
            case 'label-edit': //编辑标签
                location.href = '#!editTopicLabel/' + data.id;
                break;
            case 'article-edit': //编辑专题中的文章
                location.href = '#!editTopicArticle/' + data.id;
                break;
        }
    });
    /*表格头控制按钮*/
    table.on('toolbar(article-table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id),
            data = checkStatus.data;
        switch (obj.event) {
            case 'getCheckData':
                if (data.length == 0) {
                    layer.msg('请选择一行');
                    return false;
                }

                var articles = data;
                layer.confirm('确定删除吗？', function (index) {
                    deleteArticle(articles);
                    layer.close(index);
                });
                break;
            case 'add':
                location.href = '#!addTopic';
                break;
            case 'del':
                let arr = [];
                for(let i of data){
                    arr.push(i.row)
                }
                let idString = arr.join(',');

                $.post(setter.serverUrl+'article/topic/del',{ids:idString}, function(){
                    table.reload('article-table');
                },'json')
                break;
        }
    });

    //删除文章
    function deleteArticle(data) {
        for (var j = 0, len = data.length; j < len; j++) {
            var articleId = data[j].id;
            var data = {
                'id': articleId
            };
            jq.post(setter.serverUrl + "article/deleteArticle", data, function (data) {
                if (data.code == 200) {
                    layer.alert('删除成功！', {icon: 1, title: '提示'});
                    table.reload('article-table')
                } else {
                }
            }, "json");
        }
    }

    /*
    *编辑内容
    */
    function openEdit(data) {
        ///编辑图集
        ppp.putTempData('articleInfo', data);
        location.href = `#!editPic/${data.id}`;
    }

    $(document).on('click', '.load-cover', function () {
        var src = this.src;

        var photoArr = [
            {
                "alt": "内容图片",
                "pid": i,
                "src": src,
                "thumb": src
            }
        ];

        let json = {
            "title": "", //相册标题
            "id": 123, //相册id
            "start": 0, //初始显示的图片序号，默认0
            "data": photoArr
        };

        layer.photos({
            photos: json
            , anim: 3 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    });

    /*
    *关闭当前窗口
    */
    function closeDialog() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    }
});