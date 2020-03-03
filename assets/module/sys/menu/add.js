function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var formSelects = layui.formSelects;
        var menu = ppp.getTempData('t_menu');

        ppp.get('resources/resources', {async: false}, function (data) {
            // 渲染多选下拉框
            var resourceSelectData = new Array();
            for (var i = 0; i < data.result.length; i++) {
                resourceSelectData.push({
                    name: data.result[i].resourceName + ':' + data.result[i].perm,
                    value: data.result[i].id
                });
            }
            formSelects.data('resourceIds', 'local', {arr: resourceSelectData});
        });

        // 获取所有菜单
        ppp.get('menus/combos', {}, function (data) {
            $('#parentId').vm({parents: data.result});
            form.render('select');
            // 回显menu数据
            if (menu) {
                if (menu.menuType == 1) {
                    $("#resourceIdsDiv").hide();
                    $("#pathDiv").hide();
                    $("#routerDiv").hide();
                } else if (menu.menuType == 2) {
                    $("#pathDiv").show();
                    $("#routerDiv").show();
                    $("#resourceIdsDiv").show();
                } else if (menu.menuType == 3) {
                    $("#pathDiv").hide();
                    $("#routerDiv").hide();
                    $("#resourceIdsDiv").show();
                }
                if (menu.resourceIds) {
                    var rds = new Array();
                    for (var i = 0; i < menu.resourceIds.length; i++) {
                        rds.push(menu.resourceIds[i]);
                    }
                    formSelects.value('resourceIds', rds);
                }
                ppp.fromVal('menu-form', menu);
                iconPicker.checkIcon('iconPicker', menu.icon);
            } else {
                iconPicker.checkIcon('iconPicker', 'layui-icon-rate-half');
            }
        });
        // 表单提交事件
        form.on('select(menuType)', function (data) {
            if (data.value == 1) {
                $("#resourceIdsDiv").hide();
                $("#pathDiv").hide();
                $("#routerDiv").hide();
            } else if (data.value == 2) {
                $("#pathDiv").show();
                $("#routerDiv").show();
                $("#resourceIdsDiv").show();
            } else if (data.value == 3) {
                $("#pathDiv").hide();
                $("#routerDiv").hide();
                $("#resourceIdsDiv").show();
            }
        });
        // 表单提交事件
        form.on('submit(menu-form-submit)', function (data) {
            //定义一数组
            var resourceIds = new Array();
            if (data.field.resourceIds) {
                resourceIds = data.field.resourceIds.split(",");
            }
            data.field.resourceIds = resourceIds;
            layer.load(2);
            if (data.field.id) {
                console.log('data='+data.field);
                ppp.post('menus/update', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    location.reload();
                });
            } else {
                ppp.post('menus/add', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            }
            return false;
        });
        iconPicker.render({
            // 选择器，推荐使用input
            elem: '#iconPicker',
            // 数据类型：fontClass/unicode，推荐使用fontClass
            type: 'fontClass',
            // 是否开启搜索：true/false
            search: true,
            // 是否开启分页
            page: true,
            // 每页显示数量，默认12
            limit: 12,
            // 点击回调
            click: function (data) {
                $("#iconPicker").val(data.icon);
            }
        });
        form.render();
    });

}//函数结束