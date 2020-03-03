function Lay(layui){

 layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        $('#user-toolbar').vm({
            addShow: ppp.hasPerm("sys:user:add")
        });
        $('#user-table-bar').vm({
            editShow: ppp.hasPerm("sys:user:edit"),
            resetPwdShow: ppp.hasPerm("sys:user:resetpwd")
        });
        // 渲染表格
        var w=$(parent.window).width()-220;//获取浏览器的宽，减去侧边栏的宽度
        var count=0;
        var userTable = table.render({
            elem: '#user-table',
            // url: config.serverApiUrl + 'user/list',
            url: 'app/user/list',
            parseData:function(res){
                count=res.count;
                return {
                    "code": 0, //解析接口状态
                    //"msg": res.result, //解析提示文本
                    "count":count, //解析数据长度
                    "data": res.result //解析数据列表
                };
            },
            page: true,
            limit:10,
            width:w,
            cols: [
                    [
                        {type:'numbers',title:'序号'},
                        {field: 'id', width: 80, title: 'ID'},
                        // {field: 'logo', align: 'center', sort: true, title: '头像',templet:'#faceHtml',width:80},
                        {field: 'account', align: 'center', sort: true, title: '账号'},
                        {field: 'nickname', align: 'center', sort: true, title: '用户名'},
                        {field: 'tel', align: 'center', sort: true, title: '手机号'},
                        {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                        // {field: 'update_time', align: 'center', sort: true, title: '更新时间'},
                        {field: 'check_status', align: 'center', sort: true, title: '是否大v',templet:'#userDv'},
                        {field: 'status', align: 'center', sort: true, templet: '#user-tpl-status', title: '状态'},
                        {fixed: 'right',align:'center',title:'标签操作', toolbar: '#TagDemo'},

                    ]
                ]
            ,done:function(res,curr,count){
                ppp.hoverOpenImg();
            }
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
                    ppp.put('/users/' + obj.data.id + '/password', {}, function () {
                        layer.closeAll('loading');
                        layer.msg('重置密码成功', {icon: 1});
                    });
                });
            }else if(layEvent === 'tagadd-attr'){
                addTag(data,2);
            }else if(layEvent === 'tag-delete'){
                addTag(data,3);
            }
        });

        //添加删除标签
        var addTag = function(data,type)
        {

        console.log(data);
        if (data) {
            ppp.putTempData('t_commune_data', data);
        }
        var path = 'components/views/app/tag.html';
        ppp.popupCenter({
            title:'设置大v',
            path: path,
            finish: function () {
                userTable.reload();
            }
        });
       }


        //显示表单弹窗
        var showEditModel = function (data) {
            if (data) {
                ppp.get('user/' + data.id, {async:false}, function (data) {
                    console.error(data.result);
                    ppp.putTempData('t_user', data.result);
                });
            }
            ppp.popupCenter({
                title: data ? '修改用户' : '添加用户',
                path: 'components/views/appUser/form.html',
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
            // alert(obj.elem.status);
            console.log( obj.elem.checked ? 1 : 2);
            ppp.post('app/user/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 2 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('用户状态更新成功', {icon: 1});
                });
        });
    });



}//Lay 方法结束