function Lay(layui){
	 layui.use(['form', 'table', 'config', 'ppp', 'treetable'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var treetable = layui.treetable;
        var tableId = '#menu-table';
        $('#menu-toolbar').vm({
            addShow: ppp.hasPerm("sys:menu:add")
        });
        $('#menu-table-bar').vm({
            editShow: ppp.hasPerm("sys:menu:edit"),
            deleteShow: ppp.hasPerm("sys:menu:delete")
        });
        // 渲染表格
        var renderTable = function () {
            treetable.render({
                elem: tableId,
                //树形图标显示在第几列
                treeColIndex: 1,
                //最上级的父级id
                treeSpid: 0,
                //id字段的名称
                treeIdName: 'id',
                //pid字段的名称
                treePidName: 'pid',
                //是否默认折叠
                treeDefaultClose: false,
                toolbar: '#menu-toolbar',
                url: config.serverUrl + 'type/lists',
                headers: {Authorization: config.getToken()},
                cols: [[
                    {type: 'numbers'},
                    {field: 'id', align: 'center', sort: true, title: 'ID'},
                    {field: 'name', align: 'center', sort: true, title: '类型名称'},
                    {field: 'type', align: 'center', templet: '#type-tpl-type', title: '类型'},
                    {field: 'status', align: 'center', templet: '#type-tpl-status', title: '状态'},
                    {field: 'create_time', align: 'center', sort: true, title: '修改时间'},
                    {fixed: 'right', align: 'center', toolbar: '#type-table-bar', title: '操作'}
                ]]
            });
        };
        renderTable();

        // 表格顶部操作列
        table.on('toolbar(menu-table)', function (obj) {
            if (obj.event === 'add') {
                showEditModel();
            } else if (obj.event === 'expandAll') {
                treetable.expandAll(tableId);
            } else if (obj.event === 'foldAll') {
                treetable.foldAll(tableId);
            }
        });

        // 工具条点击事件
        table.on('tool(menu-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                showEditModel(data);
            } else if (obj.event === 'del') {
                layer.confirm('确定删除该记录吗？', function () {
                    ppp.delete('/menus/' + data.id, {}, function () {
                        layer.closeAll('loading');
                        layer.msg('删除成功', {icon: 1});
                    }, false);
                    renderTable();
                });
            }
        });

        //显示表单弹窗
        var showEditModel = function (data) {
            ppp.putTempData('t_type', data);
            ppp.popupCenter({
                title: data ? '修改类别' : '添加类别',
                path: 'components/views/types/form.html',
                finish: function () {
                    renderTable();
                }
            });
        };

        // 修改状态
        form.on('switch(type-tpl-status)', function (obj) {
            layer.load(2);
            ppp.post('type/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('状态更新成功', {icon: 1});
                });
        });
        // 修改类型
        form.on('switch(type-tpl-type)', function (obj) {
            layer.load(2);
            ppp.post('type/' + obj.elem.value + '/type',
                {data: {type: obj.elem.checked ? 2 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('类型更新成功', {icon: 1});
            });
        });
    });

}