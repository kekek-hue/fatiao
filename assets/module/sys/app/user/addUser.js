function Lay(layui){
	 layui.use(['layer', 'ppp', 'form', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var formSelects = layui.formSelects;
        // 表单提交事件
        form.on('submit(user-form-submit)', function (data) {
            layer.load(2);
            //定义一数组
            if (data.field.id) {
               ppp.post('/users/update/' + data.field.id, {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            } else {
               ppp.post('admin/addUser', {data:data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                   ppp.finishPopupCenter();
                });
            }
            return false;
        });
    });




}//方法结束