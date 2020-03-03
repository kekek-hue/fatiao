function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects','config'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var formSelects = layui.formSelects;
        var config = layui.config;
        var commentObj = ppp.getTempData('t_comment');
        var url='comment/state/update';
        // var url=config.serverApiUrl+'comment/state/update';
        console.log(url)
        // 获取所有菜单
        form.val('type-form', commentObj);
        // 表单提交事件
        form.on('submit(type-form-submit)', function (data) {
            layer.load(2);
            $.post(url, data.field,function(e){
                layer.closeAll('loading');
                layer.msg('修改成功', {icon: 1});
                ppp.finishPopupCenter();
            },'JSON');
            return false;
        });
        form.render();
    });

}//函数结束