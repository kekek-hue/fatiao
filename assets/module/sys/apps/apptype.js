function Lay(layui){
	 layui.use(['form', 'table', 'config', 'ppp', 'treetable'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var table = layui.table;
        var tableId = '#menu-table';
        $('#menu-toolbar').vm({
            addShow: ppp.hasPerm("sys:menu:add")
        });
        $('#menu-table-bar').vm({
            editShow: ppp.hasPerm("sys:menu:edit"),
            deleteShow: ppp.hasPerm("sys:menu:delete")
        });
        //渲染表格
        var renderTableEl  = table.render({
             elem: tableId,
             request: config.request,
             parseData: config.parseData,
             response: config.response,
             headers: {Authorization: config.getToken()},
             page: true,
             url: config.serverUrl + 'datacate',
             cols: [[
                 {field: 'name',align: 'center', sort: true, title: 'app类型名称'},
                 {fixed: 'right', align: 'center', toolbar: '#type-table-bar', title: '操作'}
             ]]
         });
        var renderTable = function () {
            renderTableEl.reload()
        };
        renderTable();

        // 表格顶部操作列
        $(document).on('click',".addtype", function (obj) {
            showEditModel()
        });

        // 工具条点击事件
        table.on('tool(menu-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                showEditModel(data);
            } else if (obj.event === 'del') {
                layer.confirm('确定删除该记录吗？', function () {
                    ppp.post('category/delete', {id:data.id}, function () {
                        layer.closeAll('loading');
                        layer.msg('删除成功', {icon: 1});
                    }, false);
                    renderTable();
                });
            }
        });
        //显示表单弹窗
        var showEditModel = function (data) {

            ppp.putTempData('t_app_categroy_data', data);

            ppp.popupCenter({
                title: '修改app类别',
                area:'750px',
                path: 'components/views/apps/edit.html',
                finish: function () {
                    renderTable(

                    );
                }
            });
        };
        //显示表单弹窗
        var showFormModel = function (data) {
            ppp.popupCenter({
                title: data ? '修改类别' : '添加发条app类别',
                area:'750px',
                path: 'components/views/types/app/form.html',
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