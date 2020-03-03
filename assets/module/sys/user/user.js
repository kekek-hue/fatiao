function Lay(layui){

 layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var role_list=[];
        $('#user-toolbar').vm({
            addShow: ppp.hasPerm("sys:user:add")
        });
        $('#user-table-bar').vm({
            editShow: ppp.hasPerm("sys:user:edit"),
            resetPwdShow: ppp.hasPerm("sys:user:resetpwd")
        });
        // 渲染表格
        var userTable = table.render({
            elem: '#user-table',
            toolbar: '#user-toolbar',
            url: config.serverUrl + 'admin/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {field: 'id',  title: 'ID',width: 150,},
                // {field: 'name', align: 'center', sort: true, title: '账号'},
                {field: 'name', align: 'center', sort: true, title: '用户名',width:100},
                {field: 'tel', align: 'center', sort: true, title: '手机号'},
                {field: 'email', align: 'center', sort: true, title: '邮箱'},
                {field: 'roleName', align: 'center', sort: true, title: '角色'},
                {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                {field: 'status', align: 'center', sort: true, templet: '#user-tpl-status', title: '状态'},
                {align: 'center', toolbar: '#user-table-bar', title: '操作'}
            ]]
        });
        // 表格顶部操作列
        table.on('toolbar(user-table)', function (obj) {
            if (obj.event === 'add') {
                showEditModel();
            }
        });
        // 表格操作列事件
        table.on('tool(user-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                // 修改
                showEditModel(data);
            } else if (layEvent === 'reset') {
                layer.confirm('确定重置此用户密码？', function (i) {
                    layer.close(i);
                    layer.load(2);
                    ppp.post('/users/password/' + obj.data.id, {}, function (rs) {
                        layer.closeAll('loading');
                        layer.msg(rs.msg, {icon: 1});
                    });
                });
            }
        });

         // 获取所有角色
         ppp.get('roles/roles', {}, function (data) {
             role_list=data.result;
             // $('#pId').vm({parents: data.result});
             // form.render('select');
         });

        //显示表单弹窗
        var showEditModel = function (data) {
            var datas={};
            datas['data']=[];
            datas['role_list']=role_list;
            if (data) {
                datas['data']=data;
            }
            ppp.putTempData('t_admin_user', datas);
            ppp.popupCenter({
                title: data ? '修改用户' : '添加用户',
                path: 'components/views/user/form.html',
                finish: function () {
                    userTable.reload();
                }
            });
        };

        // 搜索按钮点击事件
        $('#user-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });

        // 修改user状态
        form.on('switch(user-tpl-status)', function (obj) {
            layer.load(2);
            ppp.post('/users/status/' + obj.elem.value,
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('用户状态更新成功', {icon: 1});
                    userTable.reload('user-table', {});
                    // location.reload();
                });
        });
    });



}//Lay 方法结束