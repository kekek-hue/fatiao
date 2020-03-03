function Lay(layui){ 

  layui.use(['form', 'table', 'config', 'ppp'], function () {
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        $('#resource-toolbar').vm({
            refreshShow: ppp.hasPerm("sys:resource:refresh")
        });
        // 渲染表格
        var resourceTable = table.render({
            elem: '#resource-table',
            toolbar: '#resource-toolbar',
            url: config.serverUrl + 'resources',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {field: 'id', title: 'ID'},
                {field: 'resource_name', align: 'center', sort: true, title: '资源名称'},
                {field: 'method', align: 'center', sort: true, title: '请求方式'},
                {field: 'mapping', align: 'center', sort: true, title: '路径映射'},
                {
                    minWidth: 80, align: 'center', templet: function (d) {
                        if (d.auth_type == 1) {
                            return '<span class="layui-badge layui-bg-blue">需要登录</span>';
                        } else if (d.auth_type == 2) {
                            return '<span class="layui-badge layui-bg-green">无需鉴权</span>';
                        } else if (d.auth_type == 3) {
                            return '<span class="layui-badge layui-bg-red">需要鉴权</span>';
                        } else {
                            return '<span class="layui-badge layui-bg-gray">未知类型</span>';
                        }
                    }, title: '权限类型'
                },
                {field: 'perm', align: 'center', sort: true, title: '权限标识'},
            ]]
        });
        // 表格顶部操作列
        table.on('toolbar(resource-table)', function (obj) {
            if (obj.event === 'refresh') {
                ppp.put('/resources', {}, function () {
                    layer.msg('刷新成功', {icon: 1});
                    resourceTable.reload('resource-table', {});
                });
            }
        });
        // 搜索按钮点击事件
        $('#resource-btn-search').click(function () {
            resourceTable.reload({where: ppp.getSearchForm()});
        });
    });

}//lay方法结束