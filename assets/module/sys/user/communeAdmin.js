function Lay(layui) {

    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var role_list = [];//角色列表
        var commune_list = [];//公社列表
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
            url: config.serverUrl + 'admin/commune/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {field: 'id', width: 60, title: 'ID'},
                {field: 'name', align: 'center', sort: true, title: '用户名'},
                {field: 'tel', align: 'center', sort: true, title: '手机号'},
                {field: 'email', align: 'center', sort: true, title: '邮箱'},
                {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                {field: 'status', align: 'center', sort: true, templet: '#user-tpl-status', title: '状态'},
                {field: 'commune', align: 'center', sort: true, title: '公社'},

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
            } else if (layEvent === 'del') {
                layer.confirm('确定删除此用户？', function (i) {
                    layer.close(i);
                    layer.load(2);
                    ppp.post('admin/delUser/' + obj.data.id, {}, function (rs) {
                        layer.closeAll('loading');
                        layer.msg(rs.msg, {icon: 1});
                        userTable.reload();
                    });
                });
            }
        });

        // 获取所有角色
        ppp.get('roles/roles', {}, function (data) {
            role_list = data.result;
            // $('#pId').vm({parents: data.result});
            // form.render('select');
        });

        // 获取所有角色
        ppp.get('options/commune', {}, function (data) {
            commune_list = data;
            //渲染公社列表
            data.forEach(function (value, i) {
                var select = '';
                var optionHmtl = ' <option  data-grade=' + value.id + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
                $("#user-commune").append(optionHmtl);
            })
            form.render();
        });

        //显示表单弹窗
        var showEditModel = function (data) {
            var datas = {};
            datas['data'] = [];
            datas['role_list'] = role_list;
            datas['is_commune'] = 1;
            datas['commune_list'] = commune_list;
            if (data) {
                datas['data'] = data;
            }
            ppp.putTempData('t_admin_user', datas);
            ppp.popupCenter({
                title: data ? '修改用户' : '添加用户',
                path: 'components/views/user/form.html',
                finish: function () {
                    userTable.reload('user-table', {});
                }
            });
        };

        // 搜索按钮点击事件
        $('#user-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });

        // 禁用 修改user状态
        form.on('switch(user-tpl-status)', function (obj) {
            layer.load(2);
            let status = obj.elem.checked ? 0 : 1;
            ppp.post('users/status/' + obj.elem.value,
                {data: {status: status}}, function () {
                    layer.closeAll('loading');
                    layer.msg('用户状态更新成功', {icon: 1});
                    userTable.reload();
                });
        });
    });


}//Lay 方法结束