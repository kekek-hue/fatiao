function Lay(layui) {
    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
        //执行一个 table 实例
        jq(document).on('click', '#add', function () {
            layer.open({
                type: 1
                , title: '添加标签'
                , content: jq('#add-form').html()
                , btn: ['确定', '取消']
                , yes: function (index, layero) {
                    var tagObj = {
                        name: layero.find('#name').val(),
                        info: layero.find('#info').val(),
                        type: layero.find('#add_type').val(),
                    };
                    jq.post("../tags/addTag", tagObj, function (data) {
                        if (data.code == 200) {
                            layer.alert('修改成功', {icon: 1, title: '提示'});
                            // location.reload()
                            layer.close(index); //关闭弹层
                        } else {
                            layer.msg(data.msg);
                        }
                    }, "json");
                }, success: function () {
                    form.render();
                }
            });
        });
        //分页
        laypage.render({
            elem: 'pageNews' //分页容器的id
            , count: 100 //总页数
            , skin: '#1E9FFF' //自定义选中色值
            , theme: '#1E9FFF'

            //,skip: true //开启跳页
            , jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {offset: 'b'});
                }
            }
        });
        table.on('tool(tags-table)', function (obj) {
            var data = obj.data;
            switch (obj.event) {
                case 'edit':
                    editTag(data);
                    break;
                case 'update-attr':
                    openEdit(data.id);
                    break;
                case 'del':
                    delTag(data);
                    break;
            }
            ;
        });

        /*编辑标签*/
        function editTag(data) {
            layer.open({
                type: 1
                , title: '添加标签'
                , content: jq('#add-form').html()
                , area: ['420px', '420px']
                , btn: ['确定', '取消']
                , success: function (layero, index) {
                    layero.find('#name').val(data.name);
                    layero.find('#info').val(data.info);
                    layero.find('#id').val(data.id);
                    form.render();
                }
                , yes: function (index, layero) {
                    var tagObj = {
                        name: layero.find('#name').val(),
                        info: layero.find('#info').val(),
                        type: layero.find('#add_type').val(),
                    };
                    jq.post("../tags/addTag", tagObj, function (data) {
                        if (data.code == 200) {
                            layer.alert('修改成功', {icon: 1, title: '提示'});
                            location.reload()
                            layer.close(index); //关闭弹层
                        } else {
                            layer.msg(data.msg);
                        }
                    }, "json");
                }
            });
        }

        function delTag(data) {
            layer.confirm('确定删除吗？', function (index) {
                del(data.id);
            });
        }

        function del(id) {
            var obj = {id: id};
            jq.post("../../tags/delTag", obj, function (data) {
                console.log(data);
                table.reload('tags-table');
                layer.msg('已删除');
            }, "json");
        }

        //执行一个 table 实例
        table.render({
            elem: '#tags-table'
            , url: '../tags/lists' //数据接口
            , title: '文章列表'
            , page: true //开启分页
            , toolbar: '#tagTool'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": res.total, //解析数据长度
                    "data": res.data //解析数据列表
                };
            }
            , cols: [[ //表头
                {type: 'checkbox'}
                , {fixed: 'left', align: 'center', title: '操作', toolbar: '#barDemo'}
                , {field: 'id', title: 'id', sort: true}
                , {field: 'name', title: '名称', sort: true}
                // , {field: 'info', title: '描述', sort: true}
                , {
                    field: 'type', title: '类型', templet: function (d) {
                        if (d.type == 1) {
                            name = '点赞';
                        } else if (d.type == 2) {
                            name = '身份标签';
                        } else if (d.type == 6) {
                            name = '<font style="color:red">敏感词</font>';
                        } else {
                            name = '文章标签';
                        }
                        return name;
                    }
                }
                , {field: 'created', title: '创建时间', sort: true}
            ]]
        });
        //构建一个默认的编辑器
        layedit.set({
            uploadImage: {
                url: 'imgUpload' //接口url
                , type: 'post' //默认post
            }
        });
        //
        table.on('tool(test)', function (obj) {
            var data = obj.data;
            switch (obj.event) {
                case 'edit-attr':
                    openUpdate(data);
                    break;
                case 'add-attr':
                    openEdit(data);
                    break;
                case 'chapters-attr':
                    location.href = '/chaptersByNewId/' + data.id;
                    break;
            }
            ;
        });
        /*表格头控制按钮*/
        table.on('toolbar(tags-table)', function (obj) {
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
                        deleteTag(articles);
                        layer.close(index);
                    });
                    break;
            }
            ;
        });

        //删除文章
        function deleteTag(data) {
            for (var j = 0, len = data.length; j < len; j++) {
                var id = data[j].id;
                var data = {
                    'id': id
                };
                jq.post("../../tags/delTag", data, function (data) {
                    if (data.code == 200) {
                        layer.alert('删除成功！', {icon: 1, title: '提示'});
                        location.reload()
                    } else {
                    }
                }, "json");
            }
        }

        //分页
        laypage.render({
            elem: 'pageChapter' //分页容器的id
            , count: 100 //总页数
            , skin: '#1E9FFF' //自定义选中色值
            , theme: '#1E9FFF'

            //,skip: true //开启跳页
            , jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {offset: 'b'});
                }
            }
        });
        jq('.reload-btn').on('click', function () {
            var id = jq('#id').val();
            var name = jq('#tag-name').val();
            var type = jq('#type').val();

            //执行重载
            table.reload('tags-table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    id: id,
                    name: name,
                    type: type
                }
            });
            //查询结束
        });
    });
}
