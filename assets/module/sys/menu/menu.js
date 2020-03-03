function Lay(layui){
	 layui.use(['form', 'table', 'config', 'ppp', 'treetable','dragDrop'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var treetable = layui.treetable;
        var dragDrop = layui.dragDrop;
        var tableId = '#menu-table';
        var ele = 'dragDropTable';
        $('#menu-toolbar').vm({
            addShow: ppp.hasPerm("sys:menu:add")
        });
        $('#menu-table-bar').vm({
            editShow: ppp.hasPerm("sys:menu:edit"),
            deleteShow: ppp.hasPerm("sys:menu:delete")
        });
        var updateIndex = function(e, ui) {
          $(ui).each(function (i) {
              // console.log($(this));
          });
        };
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
                treePidName: 'parent_id',
                //是否默认折叠
                treeDefaultClose: false,
                toolbar: '#menu-toolbar',
                url: config.serverUrl + 'menus/lists',
                headers: {Authorization: config.getToken()},
                cols: [[
                    {field: 'id', align: 'center', sort: true, width: 60, title: 'ID'},
                    {field: 'menu_name', align: 'center', sort: true, title: '菜单名称'},
                    {
                        field: 'icon', title: '图标', align: 'center', width: 60, templet: function (d) {
                            return d.icon ? '<i class="layui-icon ' + d.icon + '"></i>' : '';
                        }
                    },
                    {field: 'path', align: 'center', sort: true, title: '菜单路径'},
                    {field: 'router', align: 'center', sort: true, title: '路由'},
                    {
                        align: 'center', templet: function (d) {
                            if (d.menu_type === "1") {
                                return '<span class="layui-badge layui-bg-gray">目录</span>';
                            } else if (d.menu_type === "2") {
                                return '<span class="layui-badge layui-bg-blue">菜单</span>';
                            } else if (d.menu_type === "3") {
                                return '<span class="layui-badge layui-badge-rim">按钮</span>';
                            } else {
                                return '<span class="layui-bg-black">未知</span>';
                            }
                        }, title: '类型'
                    },
                    {field: 'status', align: 'center', templet: '#menu-tpl-status', title: '状态', width: 100},
                    {field: 'update_time', align: 'center', sort: true, title: '修改时间'},
                    {fixed: 'right', align: 'center', toolbar: '#menu-table-bar', title: '操作'}
                ]],
                done:function(res,curr,count){
                    dragDrop.init({ele:ele,stop:updateIndex});
                    setTimeout(() => {
                        document.querySelector(".layui-table-main").style.minHeight=4000+'px';
                        var min= document.querySelector(".layui-table-main").style.minHeight
                        console.log(min)
                        document.querySelector(".layui-table-main").style.height=min
                    },1000);
                    
                }
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
                    $.post('delete/menu',{id:data.id},function (e) {
                        layer.closeAll('loading');
                        layer.msg(e.msg, {icon: 1});
                        console.log(e);
                        renderTable.reload();

                    });
                    // ppp.delete('/menus' + data.id, {}, function () {
                    //     layer.closeAll('loading');
                    //     layer.msg('删除成功', {icon: 1});
                    // }, false);
                    renderTable();
                });
            }
        });

        //显示表单弹窗
        var showEditModel = function (data) {
            ppp.putTempData('t_menu', data);
            // console.log(data);
            // if (data) {
            //     ppp.get('menus/edit_show/' + data.id, {async: false}, function (data) {
            //         ppp.putTempData('t_menu', data.result);
            //     });
            // }
            ppp.popupCenter({
                title: data ? '修改菜单' : '添加菜单',
                path: 'components/views/menu/form.html',
                finish: function () {
                    renderTable();
                }
            });
        };

        // 修改状态
        form.on('switch(menu-tpl-status)', function (obj) {
            layer.load(2);
            ppp.put('menus/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('菜单状态更新成功', {icon: 1});
                });
        });
    });

}