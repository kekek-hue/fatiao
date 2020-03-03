function Lay(layui){
	 layui.use(['form', 'table', 'config', 'ppp', 'treetable','laypage'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var table = layui.table;
        var tableId = '#menu-table';
        var laypage = layui.laypage; //分页
         var tyle_list=[];

        $('#menu-toolbar').vm({
            addShow: ppp.hasPerm("sys:menu:add")
        });
        $('#menu-table-bar').vm({
            editShow: ppp.hasPerm("sys:menu:edit"),
            deleteShow: ppp.hasPerm("sys:menu:delete")
        });
         laypage.render({
             elem: 'pageDemo' //分页容器的id
             ,count: 100 //总页数
             ,skin: '#1E9FFF' //自定义选中色值
             ,theme: '#1E9FFF'
             //,skip: true //开启跳页
             ,jump: function(obj, first){
                 if(!first){
                     layer.msg('第'+ obj.curr +'页', {offset: 'b'});
                 }
             }
         });

        //渲染表格
        var renderTableEl = null;
        var renderTable = function () {
           renderTableEl = table.render({
                elem: tableId,
               request: {
                   //页码的参数名称，默认：page
                   pageName: 'page',
                   //每页数据量的参数名，默认：limit
                   limitName: 'limit'
               },
                parseData: config.parseData,
                response: config.response,
                headers: {Authorization: config.getToken()},
                page: true,
                url: config.serverUrl + 'source/category/getPage',
                cols: [[
                    {type: 'numbers'},
                    {field: 'id', align: 'center', sort: true, title: '数据源类型ID'},
                    {field: 'name', align: 'center', sort: true, title: '数据源类型名称'},
                    {field: 'category_id', align: 'center', sort: true, title: 'app类型ID'},
                    {field: 'category_name',align: 'center', sort: true, title: 'app类型名称'},
                    {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                    {fixed: 'right', align: 'center', toolbar: '#type-table-bar', title: '操作'}
                ]]
            });
        };
        renderTable();

        // 表格顶部操作列
        table.on('toolbar(menu-table)', function (obj) {
            if (obj.event === 'add') {
                showFormModel();
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

         // 获取所有菜单
         ppp.get('type/lists', {}, function (data) {
             tyle_list=data.result;
             // $('#pId').vm({parents: data.result});
             // form.render('select');
         });
        //显示表单弹窗
        var showEditModel = function (data) {
            var datas={};
            datas['data']=data;
            datas['tyle_list']=tyle_list;
            // console.log(datas);
            ppp.putTempData('t_app_categroy_data', datas);
            // ppp.putTempData('tyle_list', tyle_list);
            ppp.popupCenter({
                title: '修改app类别',
                area:'750px',
                path: 'components/views/types/app/edit.html',
                finish: function () {
                    renderTable();
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