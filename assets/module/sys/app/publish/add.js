function Lay(){
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var formSelects = layui.formSelects;
        var publish = ppp.getTempData('t_publish');
        console.error(publish);
        $("#publish_id").val(publish.id);
        //获得所有版式
        ppp.get('scheme/lists', {}, function (data) {
            $('#scheme_sku_id').vm({schemes: data.result});
            form.render('select');
        });
        // 表单提交事件
        form.on('submit(scheme-form-submit)', function (data) {
            layer.load(2);
            ppp.post('schemeArticle/add', {data: data.field}, function () {
                layer.closeAll('loading');
                layer.msg('添加成功', {icon: 1});
                ppp.finishMultipleCenter();
            });
            return false;
        });
        form.render();
    });

}//函数结束