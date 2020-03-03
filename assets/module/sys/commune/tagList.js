
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
        url: config.serverUrl + 'occupation/list',
        // request: config.request,
        // parseData: config.parseData,
        parseData: function (res) { //res 即为原始返回的数据

            return {
                "code": 200, //解析接口状态
                "count": res.total, //解析数据长度
                "data": res.data //解析数据列表
            };
        },
        response: config.response,
        headers: {Authorization: config.getToken()},
        page: true,
        cols: [[
            {field: 'id', width: 60, title: 'ID'},
            // {field: 'name', align: 'center', sort: true, title: '账号'},
            {field: 'name', align: 'center', sort: true, title: '标签名称'},
            {field: 'type', align: 'center', sort: true, templet: '#user-tpl-status', title: '类型'},
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
        } else if (layEvent === 'delete') {
            layer.confirm('确定删除？', function (i) {
                layer.close(i);
                var lo = layer.load(2);
                $.post("occupation/del",{id:data.id},function(re) {
                    layer.close(lo);
                    layer.msg(re.result, {icon: 1});
                    userTable.reload();
                },'JSON');
            });
        }
    });

    //显示表单弹窗
    var showEditModel = function (data) {
        var datas={};
        datas['data']=[];
        datas['role_list']=role_list;
        if (data) {
            datas['data']=data;
        }
        ppp.putTempData('t_tag', datas);
        ppp.popupCenter({
            title: data ? '修改标签' : '添加标签',
            path: '/components/views/commune/askTagForm.html',
            finish: function () {
                userTable.reload('user-table', {});
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
                location.reload();
            });
    });
});