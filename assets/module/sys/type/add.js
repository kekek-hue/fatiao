function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var formSelects = layui.formSelects;
        var typeObj = ppp.getTempData('t_type');

        // 获取所有菜单
        ppp.get('type/lists', {}, function (data) {
            $('#pId').vm({parents: data.result});
            form.render('select');
        });
        ppp.fromVal('type-form', typeObj);
        //formSelects.value('pid', typeObj.pid);

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
                ppp.post('type/edit', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            } else {
                ppp.post('type/add', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            }
            return false;
        });
        form.render();
    });

}//函数结束