layui.use(['ppp', 'layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'setter'], function () {
    var laypage = layui.laypage //分页
        , table = layui.table //表格
        , jq = layui.jquery
        , form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate
        , setter = layui.setter
        , ppp = layui.ppp;


    //所有分类
    ppp.get('type/getTypes', {async: true}, function (data) {
        //动态添加父级分类
        data.forEach(function (value, i) {
            var optionHmtl = ' <option  data-grade=' + value.id + ' value="' + value.id + '">' + value.name + '</option>';
            $("#cate").append(optionHmtl);
        })
        form.render();
    });
    //开始时间
    laydate.render({
        elem: '#start_time'
        , type: 'datetime'
    });
    //结束时间
    laydate.render({
        elem: '#end_time'
        , type: 'datetime'
    });

    //已经添加到专题中的文章
    var articleId = ppp.getTempData('articleId');

    //可以添加到专题中的文章
    table.render({
        elem: '#article-table'
        , url: setter.serverUrl + 'article/topic/publish' //数据接口
        // , toolbar: '#articleTool'
        , title: '文章列表'
        , page: true //开启分页
        ,where: {
            articleId: articleId
        }
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
        , cols: [
            [ //表头
                {type: 'numbers', title: '序号'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#checkboxTpl'}
                // , {type: 'checkbox', hide: false}
                , {field: 'row', title: '行号', sort: true, hide: false}
                , {field: 'id', title: 'ID', sort: true}
                , {field: 'title', title: '标题'}
                , {field: 'category_name', title: '本站分类'}
                , {field: 'type_id', title: '类型', templet: '#typeHtml'}
                , {field: 'cover_id', title: '封面', templet: '#faceHtml'}
                , {field: 'abstract', title: '摘要', sort: true, totalRow: true, hide: false}
                , {field: 'published', title: '创建时间', sort: true, totalRow: true, hide: false}
                , {field: 'deleted', title: '删除时间', sort: true, totalRow: true, hide: true}
                , {field: 'chars', title: '字数', hide: true}
            ]
        ]
        , done: function (res, curr, count) {
            ppp.hoverOpenImg();
        }
    });

    //返回
    jq('#back').on('click', function(){
        location.href='#!videoList'
    });

    //获取专题文章基本信息
    jq.post(setter.serverUrl+'article/topic/get/base',{id:articleId}, function(d){
        if(d!=0){
            jq('.topic-title').html(d.title);
        }
    }, 'json');

    table.render({
        elem: '#article-table-add'
        , url: setter.serverUrl + 'article/topic/article/'+articleId //数据接口
        // , toolbar: '#articleToolAdd'
        , title: '文章列表'
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
            {type: 'numbers', title: '序号'}
            , {field: 'children_article_id', title: '加入专题', width: 110, templet: '#barDemoAdd', unresize: true}
            // , {type: 'checkbox', hide: false}
            , {field: 'row', title: '行号', sort: true, hide: false}
            , {field: 'id', title: 'ID', sort: true}
            , {field: 'title', title: '标题'}
            , {field: 'type_id', title: '类型', templet: '#typeHtml'}
            , {field: 'cover_id', title: '封面', templet: '#faceHtml'}
            , {field: 'abstract', title: '摘要', sort: true, totalRow: true, hide: false}
            , {field: 'published', title: '创建时间', sort: true, totalRow: true, hide: false}
            , {field: 'deleted', title: '删除时间', sort: true, totalRow: true, hide: true}
            , {field: 'chars', title: '字数', hide: true}
            , {field: 'category_name', title: '本站分类'}
        ]]
        , done: function (res, curr, count) {
            ppp.hoverOpenImg();
        }
    });
    //监听锁定操作
    form.on('checkbox(lock-article)', function (obj) {
        let data = {children_article_id:this.value, article_id:articleId}
        //true添加,false取消
        if(obj.elem.checked)
        {
            jq.post(setter.serverUrl+'article/topic/add',data, function(d){
                table.reload('article-table');
                table.reload('article-table-add');
            }, 'json');
        }else{
            jq.post(setter.serverUrl+'article/topic/article/del',data, function(d){
                table.reload('article-table');
                table.reload('article-table-add');
            }, 'json');
        }
    });

    //已添加的文章分页
    laypage.render({
        elem: 'pageDemoAdd' //分页容器的id
        , count: 100 //总页数
        , skin: '#1E9FFF' //自定义选中色值
        //,skip: true //开启跳页
        , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
        , jump: function (obj, first) {
            if (!first) {
                layer.msg('第' + obj.curr + '页', {offset: 'b'});
            }
        }
    });

    laypage.render({
        elem: 'pageDemo' //分页容器的id
        , count: 100 //总页数
        , skin: '#1E9FFF' //自定义选中色值
        //,skip: true //开启跳页
        , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
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
        var cate = jq('#cate').val();
        var start_time = jq('#start_time').val();
        var end_time = jq('#end_time').val();
        //执行重载
        table.reload('article-table', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: {
                id: id,
                title: title,
                abstract: info,
                type: cate,
                start_time: start_time,
                end_time: end_time,
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

            } else {

            }
        }, "json");
        return false;
    });
    /*控制按钮*/
    table.on('tool(article-table-add)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'edit-attr':
                openUpdate(data);
                break;
            case 'update-attr':
                openEdit(data);
                break;
            case 'publish-attr':
                publishArticle(data);
                // location.href = '/chaptersByNewId/'+data.id;
                break;
            case 'del-article'://删除专题中的文章
                console.log('del-article');
                delArticle(data);
                break;
            case 'getCheckData':
                var data = checkStatus.data;
                layer.alert(JSON.stringify(data));
                break;
        }
        ;
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
            case 'addArticle':
                location.href = '#!addArticle';
                break;
            case 'publishArticles':
                if (data.length == 0) {
                    layer.msg('请选择一行');
                    return false;
                }
                for (var j = 0, len = data.length; j < len; j++) {
                    var article = data[j];
                    //importArticle(article);
                    publishArticles(article);
                }

                break;
        }
        ;
    });

    //删除文章
    function deleteArticle(data) {
        var len = data.length;
        var j;
        for (j = 0; j < len; j++) {
            var articleId = data[j].id;
            var ids = {
                'id': articleId
            };
            jq.post("../../article/deleteArticle", ids, function (data) {
                if (data.code == 200) {
                    layer.alert('删除成功！', {icon: 1, title: '提示'});
                } else {
                }
            }, "json");
        }
    }

    /**
     *批量文章发布
     */
    function publishArticles(obj) {
        var data = {
            'id': obj.id
        };
        jq.post("../../article/publishArticle", data, function (data) {
            if (data.code == 200) {
                layer.alert('发布成功！', {icon: 1, title: '提示'});
                // Q.go('publishList.html');
            } else {
            }
        }, "json");
    }

    //删除文章
    function delArticle(obj){
        let data={
          article_id: articleId,
          children_article_id: obj.children_article_id
        };
        jq.post(setter.serverUrl+'article/topic/article/del', data,function(d){
            table.reload('article-table');
            table.reload('article-table-add');
        },'json')
    }

    /**
     *文章发布
     */
    function publishArticle(obj) {
        // console.log(obj);
        layer.confirm('确定发布吗？', function (index) {
            //console.error(obj);
            var data = {
                'id': obj.id
            };
            jq.post("../../article/publishArticle", data, function (data) {
                if (data.code == 200) {
                    layer.alert('发布成功！', {icon: 1, title: '提示'});
                } else {
                }
            }, "json");
        });
    }

    /*
    *编辑内容
    */
    var openEdit = function (data) {
        console.log(data);
        if (data) {
            ppp.putTempData('articleInfo', data);
        }
        location.href = '#/articleInfo/' + data.id + '/' + ppp.getTimestamp() + '.html';
    }

    /*
    *更新快捷方式
    */
    function openUpdate(data) {
        layer.open({
            type: 1,
            title: '快速属性操作',
            shade: 0.8,
            shadeClose: true,
            moveType: 1,
            content: jq('.form-dv').html(),
            success: function (layero, index) {
                jq("input[name=type][value=1]").attr("checked", data.type == 1 ? true : false);
                jq("input[name=type][value=2]").attr("checked", data.type == 2 ? true : false);
                jq("input[name=type][value=3]").attr("checked", data.type == 3 ? true : false);
                jq("input[name=type][value=4]").attr("checked", data.type == 4 ? true : false);
                jq("input[name=type][value=7]").attr("checked", data.type > 4 ? true : false);
                jq("select[name='status']").val(data.status)
                layero.find('#title-news').val(data.title);
                layero.find('#news-id').val(data.id);
                form.render();
            }
        });
    }

    /*
    *关闭当前窗口
    */
    function closeDialog() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    }
});
