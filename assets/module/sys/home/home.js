layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'treetable', 'config'], function () {
    var laypage = layui.laypage //分页
        , table = layui.table //表格
        , jq = layui.jquery
        , form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate
        , treetable = layui.treetable
        , tableId = '#data-crawler-table'
        , config = layui.config
        , ppp = layui.ppp
        , element = layui.element;


    // 工具条点击事件
    table.on('tool(data-index-table)', function (obj) {
        var data = obj.data;
        if (obj.event === 'delete') {
            layer.confirm('确定删除吗？', function (index) {
                ppp.post('schemeArticle/delete', {data: data}, function () {
                    layer.closeAll('loading');
                    jx.reload();
                });
                layer.close(index);
            });
        }
    });

    // 渲染表格
    var renderTable = function () {
        treetable.render({
            elem: tableId,
            treeColIndex: 1,
            treeSpid: 0,
            treeIdName: 'id',
            treePidName: 'parent_id',
            treeDefaultClose: true,
            url: config.serverUrl + 'crawler/newData',
            headers: {Authorization: config.getToken()},
            cols: [[
                {type: 'numbers'},
                {field: 'id', align: 'center', sort: true, title: '采集域名'},
                {
                    align: 'center', templet: function (d) {
                        if (d.url === 2) {
                            return '';
                        } else {
                            return d.name;
                        }
                    }, title: '采集网址名称'
                },
                {
                    align: 'center', templet: function (d) {
                        if (d.url === 2) {
                            return '<span class="layui-badge layui-bg-blue">' + d.name + '</span>';
                        } else {
                            return '';
                        }
                    }, title: '文章标题'
                },
                {field: 'total', align: 'center', sort: true, title: '数据总量'},
                {
                    align: 'center', templet: function (d) {
                        if (d.newData > 0) {
                            return '<span class="layui-badge layui-bg-blue">今日新数据' + d.newData + '条</span>';
                        } else if (d.url === 2) {
                            return '';
                        } else {
                            return '<span class="layui-badge layui-bg-gray">今日无新数据</span>';
                        }
                    }, title: '今日新增数据'
                },
                {
                    align: 'center', templet: function (d) {
                        if (d.url == 2) {
                            return '<a class="layui-btn layui-btn-normal layui-btn-xs preview" data-title= "' + d.name + '"   data-author= "' + d.author + '"  data-cate= "' + d.cate + '"  data-res-id= "' + d.res_id + '" data-aid = "' + d.id + '" lay-event="">预览</a>';
                        } else {
                            return '<a href ="' + d.url + '" target="_blank"> ' + d.url + '</a>';
                        }
                    }, title: 'url'
                },
                {field: 'publishtime', align: 'center', sort: true, title: '发布时间'},
            ]]
        });
    };
    renderTable();
    //layui加载结束
});