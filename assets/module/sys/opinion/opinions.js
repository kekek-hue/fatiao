function Lay(layui){

    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var role_list=[];
        $('#opinion-toolbar').vm({
            addShow: ppp.hasPerm("sys:user:add")
        });
        $('#opinion-table-bar').vm({
            editShow: ppp.hasPerm("sys:user:edit"),
            resetPwdShow: ppp.hasPerm("sys:user:resetpwd")
        });
        // 渲染表格
        var opinionTable = table.render({
            elem: '#opinion-table',
            toolbar: '#opinion-toolbar',
            url: config.serverUrl + 'opinion/list',
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
                {field: 'sendName', align: 'center', sort: true, title: '发布人'},
              
                {field: 'content', align: 'center', sort: true, title: '内容'},
                {field: 'name', align: 'center', sort: true, title: '联系人'},
                {field: 'contact', align: 'center', sort: true, title: '联系方式'},
                {field: 'created', align: 'center', sort: true, title: '创建时间'},
                {field: 'status', align: 'center', sort: true, templet: '#opinion-tpl-status', title: '类型'},
                {align: 'center', toolbar: '#opinion-table-bar', title: '操作'}
            ]]
        });


        // 表格顶部操作列
        table.on('toolbar(opinion-table)', function (obj) {
            if (obj.event === 'add') {
                showEditModel();
            }
        });

        // 表格操作列事件
        table.on('tool(opinion-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                // 修改
                showEditModel(data);
            } else if (layEvent === 'delete') {
                layer.confirm('确定删除？', function (i) {
                    layer.close(i);
                    var lo = layer.load(2);
                    $.post("opinion/delete",{id:data.id},function(re) {
                        layer.close(lo);
                        layer.msg(re.msg, {icon: 1});
                        opinionTable.reload();
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
                title: data ? '修改用户' : '添加用户',
                path: 'components/views/opinion/form.html',
                finish: function () {
                    opinionTable.reload('opinion-table', {});
                }
            });
        };

        // 搜索按钮点击事件
        $('#opinion-btn-search').click(function () {
            opinionTable.reload({where: ppp.getSearchForm()});
        });

        // // 修改user状态
        // form.on('switch(oponion-tpl-status)', function (obj) {
        //     layer.load(2);
        //     ppp.post('/users/status/' + obj.elem.value,
        //         {data: {status: obj.elem.checked ? 0 : 1}}, function () {
        //             layer.closeAll('loading');
        //             layer.msg('用户状态更新成功', {icon: 1});
        //             location.reload();
        //         });
        // });
    });



}//Lay 方法结束