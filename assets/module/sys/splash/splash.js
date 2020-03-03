function Lay(layui){
    var newCount = 1;

    layui.use(['form', 'table', 'config', 'ppp','layer'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var $ = layui.jquery;

        $('#role-toolbar').vm({
            addShow: ppp.hasPerm("sys:role:add")
        });
        $('#role-table-bar').vm({
            editShow: ppp.hasPerm("sys:role:edit"),
            permShow: ppp.hasPerm("sys:role:perm"),
            deleteShow: ppp.hasPerm("sys:role:delete")
        });
        //渲染表格
        var roleTable = table.render({
            elem: '#role-table',
            toolbar: '#role-toolbar',
            url: config.serverUrl + 'splash/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {type: 'numbers'},
                {field: 'index', align: 'center', sort: true, title: '顺序'},
                {field: 'min_shows', align: 'center', sort: true, title: '该图片必须显示的时间(秒)'},
                {field: 'max_shows', align: 'center', sort: true, title: '该图片最长显示的时间(秒)'},
                // {field: 'group', align: 'center', sort: true, title: '分组'},
                {field: 'text', align: 'center', sort: true, title: '说明文字'},
                {field: 'target_url', align: 'center', sort: true, title: '点击后跳转url'},
                {field: 'image_url', align: 'center', sort: true, title: '图片',templet:'#image'},
                {field: 'ext', align: 'center', sort: true, title: '扩展名'},
                {field: 'created', align: 'center', sort: true, title: '创建时间'},
                {field: 'is_ad', align: 'center', sort: true, title: '是否广告',templet:'#is_ad'},
                {field: 'enable', align: 'center', sort: true, title: '是否启用',templet:'#enable'},
                {align: 'center', toolbar: '#role-table-bar', title: '操作', width: 200}
            ]]
        });
        // 添加
        table.on('toolbar(role-table)', function (obj) {
            if (obj.event === 'add') {
                showEditModel();
            }
        });

        // 表单提交事件
        form.on('submit(role-form-submit)', function (data) {
            layer.load(2);
            if (data.field.id) {
                ppp.post('role/editRole', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    roleTable.reload('role-table');
                    layer.closeAll('page');
                });
            } else {
                ppp.post('role/addRole', {data:data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    roleTable.reload('role-table');
                    layer.closeAll('page');
                });
            }
            return false;
        });


        // 工具条点击事件
        table.on('tool(role-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') { //修改
                showEditModel(data);
            } else if (obj.event === 'del') { //删除
                doDelete(obj);
            } else if (obj.event === 'resource') {
                showMenuTree(data);
            }
        });
        // 显示编辑弹窗
        var showEditModel = function (data) {
            ppp.putTempData('t_splash', data);
            var title =  '添加';
            if(data){
                title =  '修改';
            }
            ppp.popupCenter({
                title: title,
                area: '1000px',
                path: 'components/views/splash/form.html',
                finish: function () {
                    table.reload('role-table');
                }
            });
        };
        // 删除
        var doDelete = function (obj) {
            layer.confirm('确定要删除吗？', function (i) {
                layer.close(i);
                layer.load(2);
                ppp.delete('splash/del/' + obj.data.row, {}, function () {
                    layer.closeAll('loading');
                    layer.msg('删除成功', {icon: 1});
                    obj.del();
                });
            });
        };

        // 搜索按钮点击事件
        $('#role-btn-search').click(function () {
            roleTable.reload({where: ppp.getSearchForm()});
        });
    });


}//方法结束