function Lay(layui) {
    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate;
        //执行一个 table 实例
        table.render({
            elem: '#article-table'
            , url: '../article/lists/1' //数据接口
            , toolbar: '#articleTool'
            , title: '文章列表'
            , page: true //开启分页
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', sort: true}
                , {field: 'title', title: '文章标题'}
                , {field: 'type_id', title: '文章类别'}
                , {field: 'face', title: '封面', templet: '#faceHtml'}
                , {field: 'info', title: '摘要', sort: true, totalRow: true}
                , {field: 'num', title: '图文数', sort: true, totalRow: true}
                , {field: 'current_time', title: '入库时间', sort: true, totalRow: true}
                , {field: 'date', title: '发布时间', sort: true, totalRow: true}
                , {field: 'update_time', title: '更新时间', sort: true, totalRow: true}
                , {field: 'type', title: '文章类型', templet: '#newType'}
                , {field: 'status', title: '状态', templet: '#newState'}
                , {field: 'author_id', title: '作者'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        //分页
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
        /*控制按钮*/
        table.on('tool(article-table)', function (obj) {
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
            }
            ;
        });

        //删除文章
        function deleteArticle(data) {
            for (var j = 0, len = data.length; j < len; j++) {
                var articleId = data[j].id;
                var data = {
                    'id': articleId
                };
                jq.post("../../article/deleteArticle", data, function (data) {
                    if (data.code == 200) {
                        layer.alert('删除成功！', {icon: 1, title: '提示'});
                        location.reload()
                    } else {
                    }
                }, "json");
            }
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
                        location.reload()
                    } else {

                    }
                }, "json");
            });
        }

        /*
        *编辑内容
        */
        function openEdit(data) {
            location.href = '../article/add/1?newId=' + data.id;
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
}

//add
function addNews() {
    location.href = '../article/add/1';
}

