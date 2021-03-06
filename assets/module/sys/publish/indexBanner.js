function Lay(layui) {
    layui.use(['form', 'table', 'config', 'ppp', 'laydate', 'setter', 'jquery'], function () {
        var form = layui.form,
            table = layui.table,
            config = layui.config,
            layer = layui.layer,
            ppp = layui.ppp,
            laydate = layui.laydate;

        var setter = layui.setter;
        var $ = layui.jquery;
        // 渲染表格
        var userTable = table.render({
            elem: '#user-table',
            // toolbar: '#articleTool',
            url: config.serverUrl + 'publish/index',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            where: {type: 2},
            cols: [
                [
                    {type: 'numbers'},
                    {type: 'checkbox'},
                    {align: 'center', width: 200, toolbar: '#user-table-bar', title: '操作'},
                    {field: 'id', align: 'center', sort: true, title: '文章id'},
                    {field: 'title', align: 'center', sort: true, title: '标题'},
                    {field: 'coverPath', align: 'center', sort: true, title: '封面', templet: '#faceHtml'},
                    {field: 'published', align: 'center', sort: true, title: '发布时间'},
                    {field: 'images', align: 'center', sort: true, title: '章节数/图片数'},
                    {field: 'chars', align: 'center', sort: true, title: '总字数'},
                    // {fixed: 'right', align: 'center', title: '标签操作', toolbar: '#TagDemo'},
                    // {field: 'abstract', align: 'center', sort: true, title: '摘要'},
                ]
            ]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
                for( var i in res.data){
                    layer.photos({
                        photos: '#layer-photos-'+res.data[i].id
                        ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });
                }
            }
        });
        /*表格头控制按钮*/
        table.on('toolbar(user-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data;
            switch (obj.event) {
                case 'imgExp':
                    if (data.length == 0) {
                        layer.msg('请选择一行');
                        return false;
                    }
                    var articles = data;
                    layer.confirm('确定导入吗？', function (index) {
                        imgExp(articles);
                        layer.close(index);
                    });
                    break;
            }
        });

        //删除文章
        function imgExp(data) {
            for (var j = 0, len = data.length; j < len; j++) {
                var reqData = {
                    id: data[j].info_id
                };
                ppp.post('article/imgExp', {data: reqData}, function (data) {

                });
            }
        }

        //添加标签
        var addTag = function (data, type) {
            if (data) {
                ppp.putTempData('t_commune_data', data);
            }

            var path = '';

            if (type == 2) {
                path = 'components/views/publish/tag.html';
            } else {
                path = 'components/views/publish/tagdel.html';
            }

            ppp.popupCenter({
                title: (type == 2 ? '添加标签' : '删除标签'),
                path: path,
                finish: function () {
                    // renderTable();
                }
            });
        }

        //分类列表
        $.get(setter.serverUrl + 'category/getList', function (d) {
            var data = d.result;
            category.items = data;
            for (let v of data) {
                $('#category').append(`<option  value="${v.id}">${v.name}</option>`)
            }
            form.render();
        }, 'json');

        // 表格操作列事件
        table.on('tool(user-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                // 修改
                showEditModel(data);
            } else if (layEvent === 'scheme-select') {
                showSelectSchemeModel(data);
            } else if (layEvent === 'publish-delete') {
                deletePublishArticle(data);
            } else if (layEvent === 'tagadd-attr') {
                addTag(data, 2);
            } else if (layEvent === 'tag-delete') {
                addTag(data, 3);
            } else if (layEvent === 'publish-banner') {
                addPublishToBanner(data)
            } else if (layEvent === 'publish-hot') {
                addPublishToHot(data);
            }


        });

        /***
         * @author lifang
         * @param data
         * @deesc 设置添加为热点文章
         * @time 2019-9-25
         */
        function addPublishToHot(data) {
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

        /***
         * @author lifang
         * @param data
         * @desc  设置添加为轮播图文章
         * @time 2019-9-25
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
        }

        var deletePublishArticle = function (data) {
            layer.confirm('确定删除？', function (i) {
                layer.load(2);
                ppp.post('publish/index/delete', {data: data}, function () {
                    layer.closeAll('loading');
                    layer.msg('删除成功', {icon: 1});
                    userTable.reload();
                });
            });

        }
        //显示表单弹窗
        var showSelectSchemeModel = function (data) {
            console.log(data);

            if (data) {
                ppp.putTempData('t_publish', data);
                ppp.popupCenter({
                    title: '选择版式',
                    path: 'components/views/publish/form.html',
                    finish: function () {
                        renderTable();
                    }
                });
            }
        };

        //显示表单弹窗
        var showEditModel = function (data) {
            if (data) {
                console.error(data);
                location.href = '#/articleInfo/' + data.info_id + '/' + ppp.getTimestamp() + '.html';
            }
        };

        // 搜索按钮点击事件
        $('#user-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });

        // 修改user状态
        form.on('switch(publish-tpl-status)', function (obj) {
            layer.load(2);
            ppp.post('publish/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('发布状态更新成功', {icon: 1});
                });
        });

    });


}//Lay 方法结束