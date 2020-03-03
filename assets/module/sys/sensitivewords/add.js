function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker', 'formSelects','upload'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var sensitive = ppp.getTempData('t_sensitive');
        var lod='';
         // 获取所有菜单
         form.val('sensitive-form', sensitive);
        // 表单提交事件
        form.on('submit(menu-form-submit)', function (data) {
            //定义一数组
            lod=layer.load(2);
            var msg='添加成功';
            if (data.field.f_id) {
                msg='修改成功';
            }
            ppp.post('sensitive_words/set', {data: data.field}, function (res) {
                if(res.code!='200'){
                    layer.msg(res.msg, {icon: 2});
                    layer.close(lod);
                    return ;
                }
                layer.closeAll('loading');
                layer.msg(msg, {icon: 1});
                ppp.finishPopupCenter();
                location.reload();
            });
            return false;
        });
        form.render();
    });

}//函数结束