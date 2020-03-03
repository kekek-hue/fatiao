function Lay(layui) {
    layui.use(['ppp', 'layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'config'], function () {
        var laypage = layui.laypage //分页
            ,
            table = layui.table //表格
            ,
            jq = layui.jquery,
            form = layui.form,
            layedit = layui.layedit,
            laydate = layui.laydate,
            ppp = layui.ppp;
        config = layui.config,
            setter = layui.setter;
        //所有分类
        ppp.get('category/getList', {
            async: true
        }, function (d) {
            var data = d.result;
            if (data) {
                //动态添加父级分类
                data.forEach(function (value, i) {
                    var optionHmtl = ' <option  data-grade=' + value.id + ' value="' + value.id + '">' + value.name + '</option>';
                    $("#cate").append(optionHmtl);
                });
                form.render();
            } else {

            }
        });

        //获取所有状态
        function getStatus() {
            return new Promise((resolve, reject) => {
                ppp.get('audit/getStatus', {
                    async: true
                }, function (d) {
                    resolve(d);
                });
            })
        }
        async function statusList() {
            var data = await getStatus();
            for (let key in data) {
                var optionHmtl = ' <option  data-grade=' + key + ' value="' + key + '">' + data[key] + '</option>';
                $("#status").append(optionHmtl);

            }
            form.render();

        }
        statusList()
        var role = config.getRole();
        var userid = config.getUid();

        //开始时间
        laydate.render({
            elem: '#start_time',
            type: 'datetime'
        });
        //结束时间
        laydate.render({
            elem: '#end_time',
            type: 'datetime'
        });
        tabdata();
        async function tabdata() {
            try {
                var status = await getStatus();
                //执行一个 table 实例
                table.render({
                    elem: '#article-table',
                    url: '../audit/specialList' //数据接口
                        ,
                    toolbar: '#articleTool',
                    role: role,
                    title: '文章列表',
                    page: true //开启分页
                        ,
                    parseData: function (res) { //res 即为原始返回的数据
                        var count = res[0].pageCount;
                        var total = res[0].total;
                        var list = res[0].data;
                        list.forEach(function (item, index) {
                            item.role = role;
                            item.userId = userid;
                            item.statusAll = setter.statusArticle;
                            item.roleall = setter.roleArticle;
                            if (item.status < 11) {
                                item.statusData = "状态未定义"
                            } else {

                                item.statusData = status[item.status]
                            }

                        })
                        return {
                            "code": 0, //解析接口状态
                            "count": total,
                            "data": list //解析数据列表
                        };
                    },
                    cols: [
                        [ //表头
                            {
                                type: 'checkbox'
                            }, {
                              
                                align: 'left',
                                title: '操作',
                                toolbar: '#barDemo',
                                width:280
                            },{
                                field: 'title',
                                title: '文章标题',
                                width:330
                            }, {
                                field: 'cover_url',
                                title: '封面',
                                templet: '#faceHtml',
                                width:150
                            }, {
                                field: 'style',
                                // field: 'category_name',
                                title: '栏目',
                                templet: '#lanmu',
                                width:200
                            }, {
                                field: 'create_time',
                                title: '发布时间',
                                sort: true,
                                totalRow: true,
                                width:230
                               
                            }
                            // , {field: 'deleted', title: '删除时间', sort: true, totalRow: true, hide: true}
                            , {
                                field: 'style',
                                title: '文章类型',
                                templet: '#newType',
                                width:130
                            },
                            {
                                field: 'style',
                                title: '审核状态',
                                width:140,
                                templet: '#newState'
                            }
                            , {

                                align: 'center',
                                title: '预览',
                                toolbar: '#barLook',
                                width:160
                            },
                           
                        ]
                    ],
                    done: function (res, curr, count) {
                        ppp.hoverOpenImg();
                    }
                });

            } catch (e) {

            }
        }


        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
                ,
            count: 100 //总页数
                ,
            skin: '#1E9FFF' //自定义选中色值
                //,skip: true //开启跳页
                ,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {
                        offset: 'b'
                    });
                }
            }
        });

        //查询开始
        jq('.reload-btn').on('click', function () {
            var id = jq('#id').val();
            var title = jq('#title').val();
            var info = jq('#info').val();
            var cate = jq('#cate').val();
            var status = jq('#status').val();
            var type = jq('#type').val();
            var start_time = jq('#start_time').val();
            var end_time = jq('#end_time').val();
            //执行重载
            table.reload('article-table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: id,
                    key: title,
                    info: info,
                    type_id: type,
                    status: status,
                    category_id: cate,
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
                    layer.alert('修改成功', {
                        icon: 1,
                        title: '提示'
                    });

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
                    table.reload('article-table');
                    break;
                case 'submitAudit':
                    addAudit(data, 1);
                    table.reload('article-table');
                    break;
                case "pass":
                    addAudit(data, 1)
                    table.reload('article-table');
                    break;
                case "nopass":
                    addAudit(data, 2)
                    table.reload('article-table');
                    break;
                case 'getCheckData':
                    var data = checkStatus.data;
                    layer.alert(JSON.stringify(data));
                    break;
                case "look":
                    openLook(data)
                    break;
                case "addtic":
                    location.href = '#!editTopicArticle/' + data.id;
                    break;
                    
                case 'del':
                    layer.confirm('确定删除吗？', function (index) {
                        deleteArticle([data]);
                    });
                    break;
            };
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
                    layer.open({
                        content: '请选择添加文章类型',
                        btn: ['视频', '直播', '专题'],
                        yes: function (index, layero) {
                            location.href = '#!addVideo';
                            layer.close(index);
                        },
                        btn2: function (index, layero) {
                            location.href = '#!updateLive';
                        },
                        btn3: function (index, layero) {
                            location.href = "#!addTopic"
                        },
                        cancel: function () {

                        }
                    });

                    break;
                case 'publishArticles':
                    if (data.length == 0) {
                        layer.msg('请选择一行');
                        return false;
                    }
                    for (var j = 0, len = data.length; j < len; j++) {
                        var article = data[j];
                        //importArticle(article);
                        publishArticle(article);
                    }
                    table.reload('article-table');

                    break;
                case 'submitArticles':
                    if (data.length == 0) {
                        layer.msg('请选择一行');
                        return false;
                    }
                    for (var j = 0, len = data.length; j < len; j++) {
                        var article = data[j];
                        addAudit(article, 1);
                    }
                    table.reload('article-table');
                    break;
                case 'passArticles':
                    if (data.length == 0) {
                        layer.msg('请选择一行');
                        return false;
                    }
                    for (var j = 0, len = data.length; j < len; j++) {
                        var article = data[j];
                        addAudit(article, 1);
                    }
                    table.reload('article-table');
                    break;
                case 'nopassArticles':
                    if (data.length == 0) {
                        layer.msg('请选择一行');
                        return false;
                    }
                    for (var j = 0, len = data.length; j < len; j++) {
                        var article = data[j];
                        addAudit(article, 2);
                    }
                    table.reload('article-table');
                    break;
            };
        });

        //删除文章
        function deleteArticle(data) {
            var len = data.length;
            var j;
            for (j = 0; j < len; j++) {
                var articleId = data[j].id;
                console.log(articleId);
                var ids = {
                    'id': articleId
                };
                jq.post("../../audit/specialDelete", ids, function (data) {
                    if (data.code == 200) {
                        layer.alert('删除成功！', {
                            icon: 1,
                            title: '提示'
                        });
                        table.reload('article-table');
                    } else {
                        layer.msg(data.msg, {
                            icon: 1,
                            title: '提示'
                        });
                        table.reload('article-table');
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
                    layer.alert('发布成功！', {
                        icon: 1,
                        title: '提示'
                    });
                    // Q.go('publishList.html');
                } else {}
            }, "json");
        }

        async function publishArticle(obj) {
            if (role == 13 && obj.status == setter.statusArticle.tongguo) {
                var fabu = await publisAudit(obj);
                if (fabu.code == 200) {
                    layer.alert('发布成功！');
                    // Q.go('publishList.html');
                } else {
                    layer.alert(fabu.msg);
                }

            } else {
                layer.alert("没有此权限");
                return;
            }

        }

        function publisAudit(obj) {
            var data = {
                'id': obj.id
            };
            return new Promise((resolve, reject) => {
                jq.post("../../article/release/article", data, function (data) {
                    resolve(data);
                }, "json");

            });
        }

        /*
         *编辑内容
         */
        var openEdit = function (data) {
            if (data) {
                ppp.putTempData('articleInfo', data);
            }
            var goUrl;

            if (data.type_id == "3") {
                location.href = '#/updateVideo/id=' + data.id + '/' + ppp.getTimestamp() + '.html';
                // gourl = "#!editPic";
            } else if (data.type_id == "5") {
                location.href = '#/updateLive/id=' + data.id + '/' + ppp.getTimestamp() + '.html';
                // gourl = "#!editTopic";
            } else if (data.type_id == "4") {
                location.href = "#/editTopic/id=" + data.id + '/' + ppp.getTimestamp() + '.html';
            }

        }
        var openLook = function (data) {
            ppp.putTempData('articleInfo', data);
            location.href = '#/preview/id=' + data.id + '/type=' + data.type_id + "/" + ppp.getTimestamp() + '.html';
        }
        // 审核   
        async function addAudit(data, type) {
            if (role == setter.roleArticle.zebian && userid != data.creator_id) {
                layer.alert("没有此权限");
                return false;
            } else if (role == 11 && data.status > setter.statusArticle.zhongZhu) {
                layer.alert("没有此权限");
                return;
            } else if (role == 12 && data.status > setter.statusArticle.zhongZheng) {
                layer.alert("没有此权限");
                return;
            } else if (role == 13 && data.status > setter.statusArticle.zhongZong) {
                layer.alert("没有此权限");
                return;
            } else {
                var tijiao = await submitAudit(data, type)
                if (tijiao.code == 200) {
                    layer.msg("提交成功");
                } else {
                    layer.msg(tijiao.msg);
                }
            }
        }

        function submitAudit(data, type) {
            return new Promise((resolve, reject) => {
                jq.post("audit/submit/special", {
                    "article_id": data.id,
                    "type": type
                }, function (data) {
                    resolve(data);
                }, "json");

            });
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