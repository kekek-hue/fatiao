function Lay(layui) {
    layui.use(['setter', 'ppp', 'layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form'], function () {
        var laypage = layui.laypage //分页
            ,
            table = layui.table //表格
            ,
            jq = layui.jquery,
            form = layui.form,
            layedit = layui.layedit,
            laydate = layui.laydate,
            ppp = layui.ppp,
            setter = layui.setter;
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
     
        //执行一个 table 实例
        var userTable= table.render({
            elem: '#article-table'
                // ,url: setter.serverApiUrl+'video/list' //数据接口
                ,
            url: 'live/list' //数据接口
                ,
            toolbar: '#articleTool',
            title: '直播列表',
            page: false //开启分页
                ,
            parseData: function (res) { //res 即为原始返回的数据
                var count = res.count;
                //    var min = res.result.min_id;
                //    var max = res.result.max_id;
                var total = res.total;
                var list = res.data;
                return {
                    "code": 0, // 解析接口状态
                    "count": res.count,
                    "data": list //解析数据列表
                };
            },
            cols: [
                [ //表头
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        toolbar: '#barDemo'
                    }
                    //,{type: 'numbers',title:'序号'}
                    //,{type: 'checkbox'}
                    , {
                        field: 'row',
                        title: '行号',
                        sort: true,
                        hide: true
                    }, {
                        field: 'id',
                        title: 'ID',
                        sort: true
                    }, {
                        field: 'title',
                        title: '直播标题'
                    }, {
                        field: 'cover_id',
                        title: '封面',
                        templet: '#faceHtml-img'
                    }
                    // ,{field: 'path', title: "直播" ,templet:'#faceHtml'}
                    , {
                        field: 'create_time',
                        title: '创建时间',
                        sort: true,
                        totalRow: true,
                        hide: false
                    }
                ]
            ],
            done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

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
            var start_time = jq('#start_time').val();
            var end_time = jq('#end_time').val();
            //执行重载
            table.reload('article-table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    id: id,
                    title: title,
                    info: info,
                    type: cate,
                    start_time: start_time,
                    end_time: end_time,
                }
            });
        });

        //查询结束
        //    监听提交
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
                case 'update-attr': // 修改视频
                    // // location.href = '';
                    // location.href = '#!updateLive/id='+data.id;
                    openEdit(data)
                    break;
                case 'publish-attr':
                    if (confirm('确认是否发布')) {
                        videoRelease(data.id); // 发布视频
                    }
                    break;
                case 'delete-attr': // 删除视频
                    if (confirm('确认是否删除')) {
                        deleteVideo(data, obj);
                    }
                    break;
                    case 'publish-banner':
                 
                            addPublishToBanner(data);
                            break;
                        case 'publish-hot':
                            addPublishToHot(data);
                            break;
            };
        });
        var openEdit = function (data) {

            if (data) {
                ppp.putTempData('articleInfo', data);
            }
            location.href = '#!updateLive/id=' + data.id + '/' + ppp.getTimestamp() + '.html';
        }

        /**
         * 视频呢发布
         * @param int id 视频id
         *
         */
        function videoRelease(id) {
            if (!id) {
                layer.alert('请选择要发布的视频', {
                    icon: 1,
                    title: '提示'
                });
                return false;
            }
            jq.post('video/videoRelease', {
                'id': id
            }, function (resData) {
                if (resData.code == 200) {
                    layer.alert('发布成功', {
                        icon: 1,
                        title: '提示'
                    });
                } else if (resData.code == 301) {
                    layer.alert('已发布', {
                        icon: 1,
                        title: '提示'
                    });
                } else {
                    layer.alert('发布失败', {
                        icon: 1,
                        title: '提示'
                    });
                }
            }, "json");
        }

        /**
         * 删除视频
         * @param array $data 被删除视频
         *  
         */

        function addPublishToBanner(data) {
            ppp.post('publish/bannerPublish', {data: data}, function (e) {
                if (e.code == 200) {
                    layer.closeAll('loading');
                    layer.msg(e.msg, {icon: 1});
                    userTable.reload();
                } else {
                    layer.closeAll('loading');
                    layer.msg(e.msg, {icon: 1});
                    userTable.reload();
                }
            })
        };
        function addPublishToHot(data) {
            console.log(11111)
            ppp.post('publish/update', {data: data}, function (e) {
                if (e.code == 200) {
                    layer.closeAll('loading');
                    layer.msg(e.msg, {icon: 1});
                    userTable.reload();
                } else {
                    layer.closeAll('loading');
                    layer.msg(e.msg, {icon: 1});
                    userTable.reload();
                }
            })
        }
        function deleteVideo(data, obj) {
            jq.post('video/delVideo', data, function (resData) {
                if (resData.code == 200) {
                    layer.alert('删除成功', {
                        icon: 1,
                        title: '提示'
                    });
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                } else { // 删除失败
                    layer.alert('删除失败', {
                        icon: 1,
                        title: '提示'
                    });
                }
            }, "json");
        }

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

                case 'updatalive':
                    location.href = '#!updateLive';
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
              
            };

        });
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