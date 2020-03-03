function Lay(layui){
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        // 渲染表格
        var userTable = table.render({
            elem: '#scheme-sku-table',
            toolbar: '#scheme-sku-toolbar',
            url: config.serverUrl + 'app/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [
                    [
                        {type: 'numbers'},
                        {field: 'id', align: 'center', sort: true, title: 'id'},
                        {field: 'sid', align: 'center', sort: true, title: 'sid'},
                        {field: 'parent_id', align: 'center', sort: true, title: '父类型'},
                        {field: 'name', align: 'center', sort: true, title: '类型名称'},
                        {field: 'page_size', align: 'center', sort: true, title: '页数'},
                        {field: 'created', align: 'center', sort: true, title: '创建时间'},
                        {field: 'disabled', align: 'center', sort: true, templet: '#scheme-tpl-status', title: '状态'},
                        {align: 'center', toolbar: '#scheme-sku-table-bar', title: '操作'}
                    ]
                ]
        });
        // 表格操作列事件
        table.on('toolbar(scheme-sku-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch(layEvent){
              case 'add':
                showEditModel(data);          
              break;
            };
        });
        // 工具条点击事件
        table.on('tool(scheme-sku-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                showEditModel(data);
            } else if (obj.event === 'del') {
                /*layer.confirm('确定删除该记录吗？', function () {
                    ppp.delete('/menus/' + data.id, {}, function () {
                        layer.closeAll('loading');
                        layer.msg('删除成功', {icon: 1});
                    }, false);
                    renderTable();
                });*/
            } else if(obj.event === 'publish-article'){
                showPublishModel(data);
            }
        });

        //显示表单弹窗
        var showPublishModel = function (data) {
            ppp.putTempData('t_scheme_sku', data);
            ppp.popupCenter({
                title: '发布文章列表',
                area: '1000px',
                path: 'components/views/app/publishArticle.html',
                finish: function () {
                    renderTable();
                }
            });
        };

        //显示表单弹窗
        var showEditModel = function (data) {
            if (data) {
               /* ppp.get('app/scheme/' + data.id, {async: false}, function (data) {
                    ppp.putTempData('t_scheme_sku', data.result);
                });
                }else{*/
                ppp.putTempData('t_scheme_sku', data);
            }
            ppp.popupCenter({
                title: data ? '修改菜单' : '添加菜单',
                path: 'components/views/app/form.html',
                finish: function () {
                    renderTable();
                }
            });
        };

        // 搜索按钮点击事件
        $('#user-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });

        // 修改user状态
        form.on('switch(scheme-tpl-status)', function (obj) {
            layer.load(2);
            ppp.post('scheme/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('版式状态更新成功', {icon: 1});
                });
        });
    });



}//Lay 方法结束